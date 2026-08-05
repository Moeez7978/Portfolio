# <img src="https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Elastic-Load-Balancing.svg" width="40" align="center"/> Amazon ELB — Complete Guide for AWS Solutions Architect Associate
### Part 1 of 3 — Architecture, Types & Core Concepts

> **Elastic Load Balancing (ELB)** is AWS's managed load balancing service that automatically distributes incoming application traffic across multiple targets — EC2 instances, containers, IP addresses, and Lambda functions — across one or more Availability Zones.

---

## 📐 Why Load Balancing Exists — The Problem It Solves

Before ELB, scaling an application meant manually managing traffic distribution. A single server handling all requests is a **Single Point of Failure (SPOF)**. Load balancers solve three fundamental problems:

```
Without LB:                          With LB:
                                      
  User ──────► Server A              User ──────► Load Balancer ──► Server A
               (overloaded,                                      ──► Server B
                crashes)                                         ──► Server C
```

| Problem | Without ELB | With ELB |
|---|---|---|
| **Single Point of Failure** | One server down = app down | Traffic rerouted to healthy targets |
| **Scaling** | Manual, slow | Automatic distribution across new instances |
| **Health** | No automatic detection | Continuous health checks, unhealthy targets removed |
| **SSL Termination** | Each server manages certs | Centralized at the LB |
| **Sticky Sessions** | Complex to implement | Built-in cookie-based stickiness |

---

## 🏗️ ELB Architecture — How It Is Built

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/ELB-2.png" width="750"/>
</p>


### Core Infrastructure Components

| Component | Description |
|---|---|
| **Load Balancer Node** | Physical/virtual node deployed per AZ. Receives traffic and distributes it. |
| **Listener** | Process that checks for connection requests on a protocol/port (e.g., HTTPS:443). |
| **Target Group** | Logical grouping of targets (EC2, Lambda, IPs) that receive traffic. |
| **Target** | Individual resource receiving traffic (EC2 instance, container, IP, Lambda). |
| **Health Check** | Periodic probe to determine if a target is healthy and eligible to receive traffic. |
| **Rule** | Conditions + actions on a listener — routes traffic to the correct target group. |

### ELB Node Placement

When you create an ELB and enable it for multiple AZs, AWS deploys **one ELB node per AZ**. Each node gets its own IP address. The ELB DNS name resolves to all active node IPs.

```
                    ┌─────────────────────────────────────────┐
                    │           AWS Region (us-east-1)         │
                    │                                          │
  Internet ──DNS──► │  ELB DNS: my-alb-123.us-east-1.elb.amazonaws.com
                    │         │              │                 │
                    │    ┌────▼────┐    ┌────▼────┐           │
                    │    │  Node   │    │  Node   │           │
                    │    │  AZ-1a  │    │  AZ-1b  │           │
                    │    └────┬────┘    └────┬────┘           │
                    │         │              │                 │
                    │    ┌────▼────┐    ┌────▼────┐           │
                    │    │ Targets │    │ Targets │           │
                    │    │  AZ-1a  │    │  AZ-1b  │           │
                    │    └─────────┘    └─────────┘           │
                    └─────────────────────────────────────────┘
```

---

## 🌐 DNS → Load Balancer → Resources Flow


This is the complete request journey from a user's browser to your backend resources:

```
┌─────────────────────────────────────────────────────────────────────────────┐
│                     COMPLETE REQUEST FLOW                                    │
│                                                                              │
│  1. USER TYPES URL                                                           │
│     Browser: https://app.example.com                                         │
│                          │                                                   │
│                          ▼                                                   │
│  2. DNS RESOLUTION (Route 53)                                                │
│     Route 53 Hosted Zone: example.com                                        │
│     ALIAS Record: app.example.com → my-alb-123.us-east-1.elb.amazonaws.com  │
│     Returns: IP of nearest ELB Node (e.g., 54.12.34.56)                     │
│                          │                                                   │
│                          ▼                                                   │
│  3. TCP CONNECTION TO ELB NODE                                               │
│     Client connects to ELB Node IP on port 443                               │
│     TLS Handshake happens HERE (SSL Termination at LB)                       │
│                          │                                                   │
│                          ▼                                                   │
│  4. LISTENER EVALUATION                                                      │
│     Listener: HTTPS:443                                                      │
│     Rules evaluated top-to-bottom:                                           │
│       Rule 1: IF path = /api/*  → Forward to TargetGroup-API                │
│       Rule 2: IF path = /admin/* → Forward to TargetGroup-Admin             │
│       Default: Forward to TargetGroup-Web                                    │
│                          │                                                   │
│                          ▼                                                   │
│  5. TARGET GROUP SELECTION                                                   │
│     Target Group: TargetGroup-Web                                            │
│     Algorithm: Round Robin / Least Outstanding Requests                      │
│     Health Check: Only healthy targets eligible                              │
│                          │                                                   │
│                          ▼                                                   │
│  6. REQUEST FORWARDED TO TARGET                                              │
│     EC2 Instance / Container / Lambda / IP                                   │
│     New TCP connection opened from ELB Node → Target                        │
│     (Client IP preserved via X-Forwarded-For header)                        │
│                          │                                                   │
│                          ▼                                                   │
│  7. RESPONSE RETURNS                                                         │
│     Target → ELB Node → Client                                               │
└─────────────────────────────────────────────────────────────────────────────┘
```

> 💡 **Key Insight:** The client never talks directly to your backend. The ELB node terminates the client connection and opens a **new, separate connection** to the target. This is called a **two-connection model**.

---

## 🔀 The Four Types of ELB

AWS offers four types of load balancers. Each operates at a different layer of the OSI model and serves different use cases.

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/ALBvsNLB-1.png" width="750"/>
</p>


### Quick Comparison

| Feature | CLB (Classic) | ALB (Application) | NLB (Network) | GWLB (Gateway) |
|---|---|---|---|---|
| **OSI Layer** | Layer 4 & 7 (limited) | Layer 7 | Layer 4 | Layer 3 + 4 |
| **Protocol** | HTTP, HTTPS, TCP | HTTP, HTTPS, WebSocket, gRPC | TCP, UDP, TLS | IP (all protocols) |
| **Target Types** | EC2 only | EC2, IP, Lambda, Containers | EC2, IP, ALB | EC2 (appliances) |
| **Host/Path Routing** | ❌ | ✅ | ❌ | ❌ |
| **Static IP** | ❌ | ❌ (use Global Accelerator) | ✅ (per AZ) | ❌ |
| **Preserve Client IP** | ❌ (X-Forwarded-For) | ❌ (X-Forwarded-For) | ✅ (native) | ✅ |
| **WebSockets** | ❌ | ✅ | ✅ | ❌ |
| **gRPC** | ❌ | ✅ | ❌ | ❌ |
| **Performance** | Moderate | High | Ultra-low latency | Transparent |
| **Use Case** | Legacy apps | Modern web apps | Extreme performance | Security appliances |
| **Status** | Legacy (avoid) | ✅ Recommended | ✅ Recommended | ✅ Specialized |

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/ALBvsNLB-2.png" width="750"/>
</p>
---

## 1️⃣ Classic Load Balancer (CLB) — Legacy

> **Verdict: Do NOT use for new applications. AWS recommends migrating to ALB or NLB.**

The original ELB. It operates at both Layer 4 and Layer 7 but with very limited Layer 7 capabilities. It only supports **one SSL certificate** and **one application per CLB**.

### Why It's Legacy

```
CLB Limitations:
  ✗ One SSL cert per CLB (expensive for multi-domain apps)
  ✗ No content-based routing (no path/host rules)
  ✗ Only supports EC2-Classic and EC2-VPC (old instances)
  ✗ No support for containers, Lambda, or IP targets
  ✗ No WebSocket support
  ✗ No SNI (Server Name Indication)
```

### When You Still See It

- Legacy applications built before 2016
- Exam questions testing your knowledge of its limitations
- Migration scenarios (CLB → ALB/NLB)

---

## 2️⃣ Application Load Balancer (ALB) — Layer 7

The **most feature-rich** ELB type. Operates at Layer 7 (HTTP/HTTPS) and understands the content of requests — headers, paths, query strings, methods, and source IPs.

### ALB Architecture

```
                         ┌──────────────────────────────────────┐
                         │        Application Load Balancer      │
                         │                                       │
  HTTPS:443 ──────────►  │  Listener: HTTPS:443                 │
                         │  Certificate: ACM cert (SNI support)  │
                         │                                       │
                         │  Rules (evaluated top → bottom):      │
                         │  ┌─────────────────────────────────┐  │
                         │  │ IF host = api.example.com       │  │
                         │  │ AND path = /v2/*                │  │
                         │  │ → Forward → TG-API-v2           │  │
                         │  ├─────────────────────────────────┤  │
                         │  │ IF path = /images/*             │  │
                         │  │ → Forward → TG-Images           │  │
                         │  ├─────────────────────────────────┤  │
                         │  │ IF method = POST                │  │
                         │  │ → Forward → TG-Writers          │  │
                         │  ├─────────────────────────────────┤  │
                         │  │ DEFAULT → Forward → TG-Web      │  │
                         │  └─────────────────────────────────┘  │
                         └──────────────────────────────────────┘
                                  │         │         │
                             ┌────▼──┐ ┌────▼──┐ ┌───▼───┐
                             │TG-API │ │TG-Img │ │TG-Web │
                             │v2     │ │       │ │       │
                             └───────┘ └───────┘ └───────┘
```

### ALB Listener Rules — Conditions

| Condition Type | Example | Use Case |
|---|---|---|
| **Host Header** | `api.example.com` | Multi-domain / microservices routing |
| **Path Pattern** | `/api/*`, `/images/*` | Microservices on same domain |
| **HTTP Method** | `GET`, `POST` | Read vs write routing |
| **Query String** | `?version=2` | A/B testing, versioning |
| **HTTP Header** | `X-Custom-Header: value` | Custom routing logic |
| **Source IP** | `10.0.0.0/8` | Internal vs external routing |

### ALB Listener Rules — Actions

| Action | Description |
|---|---|
| **Forward** | Send to one or more target groups (with weights for A/B testing) |
| **Redirect** | HTTP → HTTPS redirect, URL rewrite |
| **Fixed Response** | Return a static HTTP response (200, 404, etc.) |
| **Authenticate** | Integrate with Cognito or OIDC provider |

### ALB Target Types

```
Target Group Types:
  ├── instance   → EC2 instance ID (traffic via private IP)
  ├── ip         → Any IP (on-prem via Direct Connect, containers)
  └── lambda     → Invoke Lambda function (HTTP → JSON event)
```

### ALB Key Features

| Feature | Detail |
|---|---|
| **SNI (Server Name Indication)** | Multiple SSL certs on one ALB — one per listener rule |
| **WebSocket** | Full duplex persistent connections supported |
| **gRPC** | Native gRPC protocol support for microservices |
| **HTTP/2** | Supported between client and ALB |
| **Sticky Sessions** | Duration-based or application-based cookies |
| **WAF Integration** | AWS WAF can be attached directly to ALB |
| **Cognito Auth** | Authenticate users before forwarding to targets |
| **Access Logs** | Detailed request logs to S3 |
| **Request Tracing** | Adds `X-Amzn-Trace-Id` header to every request |

### ALB — Client IP Preservation

ALB terminates the client connection. The backend sees the **ELB node's IP**, not the client's IP. To get the real client IP:

```
X-Forwarded-For: <client-ip>, <proxy-ip>
X-Forwarded-Port: 443
X-Forwarded-Proto: https
```

> 💡 **Exam Tip:** ALB is the answer for: content-based routing, microservices, containers (ECS/EKS), Lambda targets, WebSocket, gRPC, Cognito authentication, and WAF integration.

---

## 3️⃣ Network Load Balancer (NLB) — Layer 4

Operates at **Layer 4 (TCP/UDP/TLS)**. Does NOT inspect HTTP content. Designed for **extreme performance** — millions of requests per second with single-digit millisecond latency.

### NLB Architecture

```
                    ┌──────────────────────────────────────┐
                    │        Network Load Balancer          │
                    │                                       │
  TCP:443 ────────► │  Listener: TCP:443                   │
                    │                                       │
                    │  No rules — pure protocol routing     │
                    │  Passes through raw TCP/UDP packets   │
                    │                                       │
                    │  Static IP per AZ (Elastic IP)        │
                    └──────────────────────────────────────┘
                              │           │
                    ┌─────────▼──┐  ┌─────▼──────┐
                    │  Target    │  │  Target    │
                    │  Group     │  │  Group     │
                    │  TCP:443   │  │  UDP:53    │
                    └────────────┘  └────────────┘
```

### NLB Key Features

| Feature | Detail |
|---|---|
| **Static IP** | One static IP per AZ (can assign Elastic IP) — whitelistable |
| **Client IP Preservation** | Backend sees the **real client IP** natively (no X-Forwarded-For needed) |
| **Ultra-Low Latency** | Single-digit millisecond latency |
| **TLS Offloading** | Can terminate TLS (like ALB) or pass-through raw TLS |
| **UDP Support** | DNS, gaming, IoT, streaming — ALB cannot do this |
| **PrivateLink** | NLB is the endpoint for AWS PrivateLink services |
| **Zonal DNS** | Each AZ node has its own DNS name for zonal isolation |
| **ALB as Target** | NLB can forward to an ALB (NLB for static IP + ALB for routing) |

### NLB Target Types

```
Target Group Types:
  ├── instance   → EC2 instance ID
  ├── ip         → Any IP (on-prem, containers)
  └── alb        → Application Load Balancer (NLB → ALB chaining)
```

### NLB — TLS Pass-Through vs TLS Termination

```
TLS Termination at NLB:
  Client ──TLS──► NLB (decrypts) ──TCP──► Target
  (NLB holds the cert, backend gets plain traffic)

TLS Pass-Through:
  Client ──TLS──► NLB (passes raw TCP) ──TLS──► Target
  (End-to-end encryption, target holds the cert)
  Use when: compliance requires E2E encryption, mutual TLS (mTLS)
```

> 💡 **Exam Tip:** NLB is the answer for: static IP requirements, UDP traffic, extreme performance (gaming, IoT, financial trading), PrivateLink, and when the backend needs to see the real client IP natively.

---

## 4️⃣ Gateway Load Balancer (GWLB) — Layer 3/4

The newest ELB type. Designed specifically to deploy, scale, and manage **third-party virtual network appliances** — firewalls, intrusion detection systems (IDS/IPS), deep packet inspection tools.

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/GWLB-1.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/GWLB-2.png" width="750"/>
</p>

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/GWLB-3.png" width="750"/>
</p>

### GWLB Architecture

```
                    ┌──────────────────────────────────────────────┐
                    │              Traffic Flow with GWLB           │
                    │                                              │
  Internet ────────►│  Internet Gateway                           │
                    │         │                                    │
                    │         ▼  (Route Table: 0.0.0.0/0 → GWLB)  │
                    │  Gateway Load Balancer                       │
                    │  (GENEVE protocol, port 6081)                │
                    │         │                                    │
                    │         ▼                                    │
                    │  Security Appliance Fleet                    │
                    │  (Palo Alto, Fortinet, CheckPoint, etc.)     │
                    │         │                                    │
                    │         ▼  (Traffic returned after inspect)  │
                    │  Gateway Load Balancer (returns traffic)     │
                    │         │                                    │
                    │         ▼                                    │
                    │  Application Servers (EC2, etc.)             │
                    └──────────────────────────────────────────────┘
```

### GWLB Key Features

| Feature | Detail |
|---|---|
| **GENEVE Protocol** | Encapsulates packets on port 6081 — preserves original packet |
| **Transparent Inspection** | Appliances see original source/dest IPs |
| **Bump-in-the-Wire** | Traffic flows through appliances without changing routing |
| **GWLB Endpoint** | VPC endpoint that intercepts traffic via route tables |
| **Horizontal Scaling** | Scale appliance fleet automatically |
| **Flow Stickiness** | Same flow always goes to same appliance (5-tuple hash) |

### When to Use GWLB

```
Use GWLB when you need:
  ✓ Third-party firewall (Palo Alto, Fortinet, CheckPoint)
  ✓ Intrusion Detection/Prevention (IDS/IPS)
  ✓ Deep Packet Inspection (DPI)
  ✓ Centralized security inspection across multiple VPCs
  ✓ Compliance requiring all traffic to pass through security appliances
```

> 💡 **Exam Tip:** If the question mentions "third-party virtual appliances", "inline inspection", "transparent security", or "GENEVE" — the answer is GWLB.

---

## 🎯 When to Use Which Type — Decision Tree

```
                    ┌─────────────────────────────┐
                    │   What does your app need?   │
                    └──────────────┬──────────────┘
                                   │
              ┌────────────────────┼────────────────────┐
              │                    │                    │
              ▼                    ▼                    ▼
   Third-party firewall/    HTTP/HTTPS traffic?   TCP/UDP/extreme
   security appliance?      Layer 7 routing?      performance?
              │                    │                    │
              ▼                    ▼                    ▼
           GWLB                  ALB                  NLB
                                  │                    │
                         ┌────────┴──────┐    ┌───────┴──────┐
                         │               │    │              │
                    Microservices    WebSocket  Static IP   UDP traffic
                    Path routing     gRPC       PrivateLink  Gaming/IoT
                    Cognito auth     Lambda     Real client  Financial
                    WAF              targets    IP needed    trading
```

| Scenario | Best Choice | Why |
|---|---|---|
| Web application with `/api` and `/web` paths | **ALB** | Content-based routing |
| Real-time gaming server (UDP) | **NLB** | UDP support, ultra-low latency |
| Need to whitelist a fixed IP for firewall rules | **NLB** | Static Elastic IP per AZ |
| Microservices on ECS/EKS | **ALB** | Container-aware, path/host routing |
| Lambda function as backend | **ALB** | Only LB that supports Lambda targets |
| Palo Alto firewall inspection | **GWLB** | Virtual appliance fleet management |
| PrivateLink service endpoint | **NLB** | NLB is required for PrivateLink |
| User authentication before app access | **ALB** | Cognito/OIDC integration |
| Financial trading (microsecond matters) | **NLB** | Single-digit ms latency |
| Legacy EC2-Classic app | **CLB** | Only option (but migrate ASAP) |
| NLB + content routing combined | **NLB → ALB** | Chain NLB (static IP) → ALB (routing) |

---

## 🔊 Listeners & Rules — Deep Dive

<p align="center">
  <img src="https://raw.githubusercontent.com/acantril/aws-sa-associate-saac03/main/1500-HA_and_SCALING/00_LEARNINGAIDS/ELBListners.png" width="750"/>
</p>

### Listener Configuration

A **Listener** is the entry point of your load balancer. It defines:
- **Protocol** — HTTP, HTTPS, TCP, UDP, TLS, TCP_UDP
- **Port** — 1–65535
- **Default Action** — what to do if no rule matches

```
ALB Listener Example:
  Protocol: HTTPS
  Port: 443
  SSL Certificate: arn:aws:acm:us-east-1:123:certificate/abc
  Default Action: Forward to TG-Default

  Rules:
    Priority 1: IF path-pattern = /api/* → Forward to TG-API (weight: 80%)
                                         → Forward to TG-API-v2 (weight: 20%)
    Priority 2: IF host-header = admin.example.com → Authenticate (Cognito)
                                                    → Forward to TG-Admin
    Priority 3: IF http-header X-Beta = true → Forward to TG-Beta
    Default:    Forward to TG-Default
```

### Rule Priority

- Rules are evaluated **top to bottom** by priority number (1 = highest)
- **Default rule** always has the lowest priority (evaluated last)
- First matching rule wins — subsequent rules are NOT evaluated

### Weighted Target Groups (ALB)

Forward action can split traffic across multiple target groups with weights:

```
Rule: Forward to:
  ├── TG-Production  (weight: 90)  → 90% of traffic
  └── TG-Canary      (weight: 10)  → 10% of traffic

Use case: Canary deployments, A/B testing, blue/green deployments
```

> 📸 **Visual diagrams throughout this guide are sourced from [Adrian Cantrill's AWS SAA-C03 course](https://learn.cantrill.io) — highly recommended for anyone serious about AWS certifications.**

---

*Continued in Part 2 → Cross-Zone Load Balancing, Health Checks, Sticky Sessions, SSL/TLS, and Connection Draining*
