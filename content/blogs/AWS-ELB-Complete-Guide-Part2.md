---
title: "Amazon ELB — Complete Guide (Part 2): Cross-Zone LB, Health Checks, Sticky Sessions & SSL/TLS"
date: "2025-05-01"
excerpt: "Part 2 of the ELB series covers cross-zone load balancing, health check configuration, sticky sessions, SSL/TLS termination with SNI, and connection draining."
tags: ["AWS", "ELB", "Networking", "SSL", "DevOps"]
---

# <img src="https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Elastic-Load-Balancing.svg" width="40" align="center"/> Amazon ELB — Complete Guide for AWS Solutions Architect Associate
### Part 2 of 3 — Cross-Zone LB, Health Checks, Sticky Sessions, SSL/TLS & Connection Draining

---

## ⚖️ Cross-Zone Load Balancing

This is one of the most important and most tested ELB concepts. Understanding it requires understanding how ELB nodes work.

### The Problem Without Cross-Zone Load Balancing

```
Scenario: 2 AZs, AZ-A has 2 targets, AZ-B has 8 targets
DNS returns both ELB node IPs equally (50/50 split)

WITHOUT Cross-Zone Load Balancing:
─────────────────────────────────────────────────────────
  Client requests (100 total)
       │
       ├── 50 requests → ELB Node AZ-A
       │                      │
       │              ┌───────┴───────┐
       │              ▼               ▼
       │         Target A-1       Target A-2
       │         (25 req)         (25 req)   ← OVERLOADED
       │
       └── 50 requests → ELB Node AZ-B
                              │
              ┌───────┬───────┼───────┬───────┐
              ▼       ▼       ▼       ▼       ▼
           B-1(6) B-2(6) B-3(6) B-4(6) ... B-8(6) ← UNDERLOADED

Result: AZ-A targets handle 25 req each, AZ-B targets handle ~6 req each
        UNEVEN distribution — AZ-A targets are 4x more loaded!
```

### With Cross-Zone Load Balancing Enabled

```
WITH Cross-Zone Load Balancing:
─────────────────────────────────────────────────────────
  Client requests (100 total)
       │
       ├── 50 requests → ELB Node AZ-A ──────────────────────────────┐
       │                      │                                       │
       │              Distributes across ALL 10 targets in ALL AZs    │
       │                                                              │
       └── 50 requests → ELB Node AZ-B ──────────────────────────────┘
                              │
              Each of the 10 targets receives exactly 10 requests
              (regardless of which AZ they are in)

Result: All 10 targets handle 10 req each — PERFECTLY EVEN ✅
```

### Cross-Zone Behavior Per ELB Type

| ELB Type | Default | Can Change? | Inter-AZ Data Transfer Cost |
|---|---|---|---|
| **ALB** | ✅ Always ON | ❌ Cannot disable | Free (no charge) |
| **NLB** | ❌ OFF | ✅ Enable per TG | 💰 Charged (inter-AZ data) |
| **GWLB** | ❌ OFF | ✅ Enable per TG | 💰 Charged (inter-AZ data) |
| **CLB** | ❌ OFF | ✅ Enable | Free if enabled |

### Cross-Zone — Zonal Shift Interaction

When Cross-Zone is **disabled** on NLB, each AZ node only routes to targets in its own AZ. This enables **Zonal Shift** — you can shift traffic away from an impaired AZ without affecting other AZs.

```
Cross-Zone OFF + Zonal Shift:
  AZ-A impaired → Shift AZ-A traffic to AZ-B
  AZ-B node handles all traffic → AZ-B targets only
  AZ-A targets receive zero traffic

Cross-Zone ON:
  Zonal Shift still works but traffic from AZ-B node
  may still reach AZ-A targets (cross-zone routing)
```

> 💡 **Exam Tip:** ALB always has Cross-Zone ON and it's free. NLB has it OFF by default and charges for inter-AZ data transfer when enabled. This is a common exam trap.

---

## 🏥 Health Checks — How ELB Knows a Target is Alive

Health checks are the mechanism by which ELB determines whether a target is healthy and eligible to receive traffic. An unhealthy target is **automatically removed** from rotation.

### Health Check Flow

```
ELB Node ──── Health Check Request ────► Target
              (every interval seconds)
                                          │
                                    ┌─────▼──────┐
                                    │  Response? │
                                    └─────┬──────┘
                                          │
                    ┌─────────────────────┼─────────────────────┐
                    │                     │                     │
                    ▼                     ▼                     ▼
             2xx/3xx HTTP           Timeout / 5xx         Connection
             response               response              refused
                    │                     │                     │
                    ▼                     ▼                     ▼
            HealthyThreshold      UnhealthyThreshold     UnhealthyThreshold
            count reached         count reached          count reached
                    │                     │                     │
                    ▼                     ▼                     ▼
              HEALTHY ✅            UNHEALTHY ❌           UNHEALTHY ❌
         (receives traffic)     (removed from rotation) (removed from rotation)
```

### Health Check Configuration

| Parameter | Description | Default | Recommended |
|---|---|---|---|
| **Protocol** | HTTP, HTTPS, TCP, UDP | Varies | Match your app protocol |
| **Path** | HTTP path to check (e.g., `/health`) | `/` | Dedicated `/health` endpoint |
| **Port** | Port to check | Traffic port | Same as traffic port |
| **Healthy Threshold** | Consecutive successes to mark healthy | 3 | 2–3 |
| **Unhealthy Threshold** | Consecutive failures to mark unhealthy | 3 | 2–3 |
| **Timeout** | Seconds to wait for response | 5s | 5–10s |
| **Interval** | Seconds between checks | 30s | 10–30s |
| **Success Codes** | HTTP codes considered healthy | 200 | 200-299 |

### Health Check Best Practices

```
❌ Bad health check endpoint:
   GET /  → Returns 200 but also queries DB, calls external APIs
   Problem: Slow, expensive, cascading failures

✅ Good health check endpoint:
   GET /health → Returns {"status": "ok"} with 200
   Checks: App is running, can accept connections
   Does NOT check: DB, external services (those have their own health)

✅ Deep health check (optional):
   GET /health/deep → Checks DB connectivity, cache, dependencies
   Use for: Readiness probes, not liveness probes
```

### Target States

| State | Description |
|---|---|
| **initial** | Target just registered, health check not yet run |
| **healthy** | Passing health checks, receiving traffic |
| **unhealthy** | Failing health checks, NOT receiving traffic |
| **unused** | Target registered but target group not attached to LB |
| **draining** | Deregistering — existing connections finishing, no new traffic |
| **unavailable** | Health checks disabled |

---

## 🍪 Sticky Sessions (Session Affinity)

By default, ELB distributes each request independently. Sticky sessions ensure a **user's requests always go to the same target** for the duration of their session.

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/SessionStickiness.png" width="750"/>
</p>

### How Stickiness Works

```
WITHOUT Stickiness:
  User Session:
    Request 1 → Target A (creates session data)
    Request 2 → Target B (no session data — user logged out!)
    Request 3 → Target C (no session data — broken experience)

WITH Stickiness:
  User Session:
    Request 1 → Target A (creates session data, LB sets cookie)
    Request 2 → Target A (cookie present, LB routes to same target)
    Request 3 → Target A (consistent experience ✅)
```

### Stickiness Types (ALB)

| Type | Cookie Name | Duration | Who Sets Cookie |
|---|---|---|---|
| **Duration-based** | `AWSALB` | 1 second – 7 days | ALB generates and manages |
| **Application-based** | Custom name | App-defined | App generates, ALB uses it |

### Duration-Based Stickiness

```
ALB sets cookie: AWSALB=<encrypted-target-info>; Expires=<duration>

Flow:
  1. First request → ALB picks target (round robin)
  2. ALB sets AWSALB cookie in response
  3. Subsequent requests include AWSALB cookie
  4. ALB reads cookie → routes to same target
  5. Cookie expires → next request goes through normal routing
```

### Application-Based Stickiness

```
App sets cookie: MyAppSession=<session-id>

Flow:
  1. App sets its own session cookie
  2. ALB reads the app cookie name (configured in TG settings)
  3. ALB uses the cookie value to determine target affinity
  4. ALB also sets AWSALBAPP cookie to track the mapping

Use when: App already manages sessions and you want LB to respect them
```

### Stickiness Caveats

```
⚠️  Problems with stickiness:
  - Uneven load distribution (one target gets all requests from heavy users)
  - If target becomes unhealthy, sticky users are re-routed (session lost anyway)
  - Doesn't work well with auto-scaling (new targets don't get sticky traffic)

✅  Better alternative:
  - Store session data externally: ElastiCache (Redis), DynamoDB
  - Stateless application design — any target can handle any request
  - Use stickiness only when external session storage is not feasible
```

> 💡 **Exam Tip:** Stickiness is enabled at the **Target Group** level, not the listener level. NLB does not support cookie-based stickiness (it uses 5-tuple hash for flow persistence instead).

---

## 🔐 SSL/TLS Termination & SNI

### SSL Termination

ELB can terminate SSL/TLS connections, offloading the cryptographic work from your backend servers.

```
SSL Termination at ALB/NLB:
─────────────────────────────────────────────────────────
  Client ──── HTTPS (TLS) ────► ELB (decrypts here)
                                      │
                                      ▼
                              ELB ──── HTTP ────► Target
                              (plain text internally)

Benefits:
  ✓ Backend servers don't need SSL certs
  ✓ Reduced CPU load on backend
  ✓ Centralized certificate management via ACM
  ✓ ALB can inspect HTTP headers for routing

End-to-End Encryption (NLB TLS Pass-Through):
─────────────────────────────────────────────────────────
  Client ──── TLS ────► NLB (passes raw TCP) ──── TLS ────► Target
  (NLB never decrypts — target holds the cert)

Use when:
  ✓ Compliance requires E2E encryption
  ✓ Mutual TLS (mTLS) required
  ✓ Backend must see original TLS handshake
```

### SNI — Server Name Indication

SNI allows **multiple SSL certificates** on a single ALB, one per domain/subdomain.

```
Without SNI (CLB limitation):
  One CLB = One SSL cert = One domain
  app.example.com → CLB-1 (cert for app.example.com)
  api.example.com → CLB-2 (cert for api.example.com)  ← Expensive!

With SNI (ALB/NLB):
  One ALB = Multiple SSL certs = Multiple domains
  app.example.com ─┐
  api.example.com ─┤─► Single ALB ─► Different target groups
  admin.example.com┘   (ALB reads SNI header, picks correct cert)

How SNI works:
  1. Client sends TLS ClientHello with SNI extension
     (includes the hostname: "api.example.com")
  2. ALB reads SNI, selects matching certificate
  3. TLS handshake completes with correct cert
  4. Request routed based on host header rule
```

### Certificate Management with ACM

```
AWS Certificate Manager (ACM) Integration:
  ✓ Free public SSL/TLS certificates
  ✓ Auto-renewal (no manual cert rotation)
  ✓ Direct attachment to ALB/NLB listeners
  ✓ Wildcard certs: *.example.com covers all subdomains

CLI: Attach cert to ALB listener
aws elbv2 add-listener-certificates \
  --listener-arn arn:aws:elasticloadbalancing:... \
  --certificates CertificateArn=arn:aws:acm:...
```

### Security Policies (TLS Versions & Ciphers)

ALB and NLB let you choose a **Security Policy** that defines which TLS versions and cipher suites are supported:

| Policy | TLS Versions | Use Case |
|---|---|---|
| `ELBSecurityPolicy-TLS13-1-2-2021-06` | TLS 1.2, 1.3 | ✅ Recommended — modern clients |
| `ELBSecurityPolicy-TLS13-1-3-2021-06` | TLS 1.3 only | Maximum security, newest clients only |
| `ELBSecurityPolicy-2016-08` | TLS 1.0, 1.1, 1.2 | Legacy clients (avoid) |
| `ELBSecurityPolicy-FS` | TLS 1.2 + Forward Secrecy | Compliance requiring FS |

> 💡 **Exam Tip:** Use `ELBSecurityPolicy-TLS13-1-2-2021-06` for most workloads. Avoid policies that include TLS 1.0/1.1 — they are deprecated and insecure.

---

## 🔌 Connection Draining (Deregistration Delay)

When a target is deregistered or marked unhealthy, ELB needs to handle **in-flight requests** gracefully. Connection Draining (called **Deregistration Delay** in ALB/NLB) handles this.

### How It Works

```
Normal State:
  ELB ──── new requests ────► Target A (healthy, registered)

Deregistration Triggered (scale-in, deployment, maintenance):
  ┌─────────────────────────────────────────────────────────┐
  │  DRAINING STATE                                         │
  │                                                         │
  │  ELB ──── NO new requests ────► Target A               │
  │  ELB ──── existing connections still active ──► Target A│
  │                                                         │
  │  Timer starts: 0 ──────────────────────► 300 seconds   │
  │                                                         │
  │  When all connections close OR timer expires:           │
  │  Target A is fully deregistered                         │
  └─────────────────────────────────────────────────────────┘
```

### Configuration

| Setting | Range | Default | Recommendation |
|---|---|---|---|
| **Deregistration Delay** | 0 – 3600 seconds | 300 seconds | Match your longest request duration |

```
Tuning guidance:
  Short-lived requests (API, microservices): 30–60 seconds
  Long-lived requests (file uploads, reports): 300–600 seconds
  WebSocket connections: Match session timeout
  Set to 0: Immediate deregistration (use only if stateless + fast)
```

> 💡 **Exam Tip:** Connection Draining = CLB term. Deregistration Delay = ALB/NLB term. Same concept, different names. Setting it to 0 means immediate deregistration — in-flight requests will be dropped.

---

## 📊 Target Groups — Deep Dive

Target Groups are the bridge between the load balancer and your actual resources. They are configured independently and can be reused across multiple load balancers.

### Target Group Configuration

```
Target Group Settings:
  ├── Target Type: instance | ip | lambda | alb
  ├── Protocol: HTTP | HTTPS | TCP | UDP | TLS | TCP_UDP
  ├── Port: 1–65535
  ├── VPC: Which VPC targets reside in
  ├── Protocol Version: HTTP1 | HTTP2 | gRPC (ALB only)
  ├── Health Check: (see Health Checks section)
  ├── Stickiness: enabled/disabled + type + duration
  ├── Deregistration Delay: 0–3600 seconds
  ├── Slow Start Duration: 0–900 seconds
  └── Load Balancing Algorithm: Round Robin | LOR | Random
```

### Load Balancing Algorithms (ALB)

| Algorithm | How It Works | Best For |
|---|---|---|
| **Round Robin** | Requests distributed sequentially to each target | Homogeneous targets, equal capacity |
| **Least Outstanding Requests (LOR)** | New request goes to target with fewest active requests | Heterogeneous targets, varying request duration |
| **Random** | Random target selection | Simple distribution, testing |
| **Weighted Random** (with Anomaly Mitigation) | Random + avoids targets showing anomalies | Production workloads with auto-scaling |

### Slow Start Mode

When a new target registers, it may not be fully warmed up (JVM, caches, etc.). Slow Start gradually increases traffic to new targets:

```
Slow Start Duration: 30 seconds (example)

  t=0s:   New target registered → receives 0% of its fair share
  t=10s:  Receives ~33% of its fair share
  t=20s:  Receives ~66% of its fair share
  t=30s:  Receives 100% of its fair share (fully ramped)

Use case: Java apps (JVM warmup), apps with in-memory caches
```

### Multi-Target Group Routing (Weighted)

```
ALB Rule with weighted forwarding:
  Forward to:
    ├── TG-Blue   (weight: 100) → 100% traffic (current production)
    └── TG-Green  (weight: 0)   → 0% traffic (new version, not live)

  Canary release:
    ├── TG-Blue   (weight: 90)  → 90% traffic
    └── TG-Green  (weight: 10)  → 10% traffic (canary)

  Full cutover:
    ├── TG-Blue   (weight: 0)   → 0% traffic (old version)
    └── TG-Green  (weight: 100) → 100% traffic (new version)
```

---

## 🌍 Regional vs Global Architecture

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/RegionalandGlobalArchitecture-1.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/RegionalandGlobalArchitecture-2.png" width="750"/>
</p>

### ELB is Regional

ELB operates within a **single AWS region**. It distributes traffic across AZs within that region but does NOT span regions.

```
Regional Architecture (Single Region):
  Route 53 ──► ALB (us-east-1) ──► Targets in us-east-1 AZs

Global Architecture (Multi-Region):
  Route 53 (Latency/Geolocation routing)
       │
       ├──► ALB (us-east-1) ──► Targets in us-east-1
       ├──► ALB (eu-west-1) ──► Targets in eu-west-1
       └──► ALB (ap-southeast-1) ──► Targets in ap-southeast-1

OR use AWS Global Accelerator:
  Global Accelerator (Anycast IPs) ──► ALB/NLB in multiple regions
  (Better performance than Route 53 — uses AWS backbone network)
```

### ELB + Auto Scaling Group Integration

```
Auto Scaling Group + ALB:
  ┌─────────────────────────────────────────────────────┐
  │                                                     │
  │  ALB ──► Target Group ──► Auto Scaling Group        │
  │                                │                    │
  │                    ┌───────────┼───────────┐        │
  │                    ▼           ▼           ▼        │
  │                  EC2-1       EC2-2       EC2-3       │
  │                                                     │
  │  Scale Out: New EC2 launched → auto-registered in TG│
  │  Scale In:  EC2 terminating → connection draining   │
  │             → deregistered from TG → terminated     │
  └─────────────────────────────────────────────────────┘

Key: ASG uses ELB health checks (not just EC2 status checks)
     If ELB marks instance unhealthy → ASG terminates and replaces it
```

---

*Continued in Part 3 → Access Logs, Monitoring, Security, PrivateLink, Pricing & Exam Tips*
