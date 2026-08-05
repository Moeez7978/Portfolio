---
title: "Amazon ELB — Complete Guide (Part 3): Security, Monitoring, PrivateLink & Exam Cheat Sheet"
date: "2025-05-10"
excerpt: "Part 3 of the ELB series covers security groups, WAF, PrivateLink, CloudWatch metrics, access logs, pricing, advanced architectural patterns, and a complete exam cheat sheet."
tags: ["AWS", "ELB", "Security", "Networking", "Architecture"]
---

# <img src="https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Elastic-Load-Balancing.svg" width="40" align="center"/> Amazon ELB — Complete Guide for AWS Solutions Architect Associate
### Part 3 of 3 — Security, Monitoring, PrivateLink, Pricing & Exam Cheat Sheet

---

## 🔒 ELB Security Architecture

### Security Groups (ALB Only)

ALB supports **Security Groups**. NLB and GWLB do **not** support security groups — they use NACLs and route table controls instead.

```
ALB Security Group Architecture:
─────────────────────────────────────────────────────────────────
  Internet
      │
      ▼
  ALB Security Group (sg-alb):
    Inbound:  Allow TCP 443 from 0.0.0.0/0 (HTTPS from internet)
    Inbound:  Allow TCP 80  from 0.0.0.0/0 (HTTP, redirect to HTTPS)
    Outbound: Allow TCP 8080 to sg-app (to reach app servers)
      │
      ▼
  EC2 Security Group (sg-app):
    Inbound:  Allow TCP 8080 from sg-alb ONLY
              (NOT from 0.0.0.0/0 — backend never exposed directly)
    Outbound: Allow all (or restrict as needed)

Key: Backend EC2s reference the ALB security group as source
     This ensures ONLY the ALB can reach the backend
     Direct internet access to EC2 is blocked ✅
```

### NLB — No Security Groups

```
NLB Security Model:
  NLB does NOT have security groups
  Traffic control is done via:
    ├── Target Security Groups (EC2 SGs must allow NLB traffic)
    ├── Network ACLs (subnet level)
    └── Route Tables

  ⚠️  NLB preserves client IP → EC2 SG must allow the CLIENT IP range
      (not the NLB IP, because NLB passes through the real client IP)

  For internet-facing NLB:
    EC2 SG Inbound: Allow TCP <port> from 0.0.0.0/0
    (or restrict to known client IP ranges)
```

### WAF Integration (ALB Only)

```
AWS WAF + ALB:
  ┌─────────────────────────────────────────────────────┐
  │  Internet ──► WAF Web ACL ──► ALB ──► Targets       │
  │                                                     │
  │  WAF Rules:                                         │
  │    ├── AWS Managed Rules (OWASP Top 10)             │
  │    ├── Rate limiting (DDoS protection)              │
  │    ├── IP reputation lists                          │
  │    ├── Geo blocking                                 │
  │    └── Custom rules (SQL injection, XSS, etc.)      │
  └─────────────────────────────────────────────────────┘

WAF is NOT available for NLB (Layer 4 — no HTTP inspection)
Use AWS Shield Advanced for NLB DDoS protection
```

### AWS Shield Integration

| Shield Tier | Protection | Cost | ELB Support |
|---|---|---|---|
| **Shield Standard** | L3/L4 DDoS protection | Free (automatic) | All ELB types |
| **Shield Advanced** | L3/L4/L7 DDoS + 24/7 DRT + cost protection | $3,000/month | All ELB types |

### Internal vs Internet-Facing ELB

```
Internet-Facing ELB:
  ├── Has a public DNS name resolving to public IPs
  ├── ELB nodes have public IP addresses
  ├── Targets can be in private subnets (ELB bridges public → private)
  └── Subnet requirement: Public subnet with IGW route

Internal ELB:
  ├── Has a private DNS name resolving to private IPs only
  ├── ELB nodes have only private IP addresses
  ├── Used for internal microservices communication
  └── Subnet requirement: Any subnet (public or private)

Architecture Pattern:
  Internet ──► Internet-Facing ALB (public subnet)
                      │
                      ▼
               Internal ALB (private subnet)
                      │
                      ▼
               Backend Services (private subnet)
```

---

## 🔗 AWS PrivateLink & NLB

PrivateLink allows you to expose a service to other VPCs or AWS accounts **without VPC peering, IGW, or NAT** — traffic stays on the AWS private network.

```
PrivateLink Architecture:
─────────────────────────────────────────────────────────────────
  Service Provider VPC (your service):
    ┌─────────────────────────────────────────┐
    │  NLB ──► EC2 / ECS / Lambda targets     │
    │   │                                     │
    │   └──► VPC Endpoint Service             │
    │        (PrivateLink service)            │
    └─────────────────────────────────────────┘
                      │
              AWS Private Network
              (no internet, no peering)
                      │
  Service Consumer VPC (customer):
    ┌─────────────────────────────────────────┐
    │  Interface VPC Endpoint                 │
    │  (ENI with private IP in consumer VPC)  │
    │         │                               │
    │         ▼                               │
    │  Consumer App ──► Endpoint ──► Service  │
    └─────────────────────────────────────────┘

Key: NLB is REQUIRED as the backend for PrivateLink endpoint services
     ALB cannot be used as a PrivateLink backend
```

### PrivateLink Use Cases

```
✓ SaaS providers exposing services to customers
✓ Shared services VPC (logging, monitoring, auth) accessed by app VPCs
✓ AWS Marketplace services
✓ Cross-account service sharing without VPC peering
✓ Compliance: traffic never leaves AWS network
```

---

## 📊 Monitoring & Observability

### CloudWatch Metrics — ALB

| Metric | Description | Alert Threshold |
|---|---|---|
| `RequestCount` | Total requests processed | Baseline + 2x stddev |
| `TargetResponseTime` | Latency from LB to target response | > 1s (app-dependent) |
| `HTTPCode_Target_2XX_Count` | Successful responses from targets | — |
| `HTTPCode_Target_4XX_Count` | Client errors from targets | Spike = bad input/auth issues |
| `HTTPCode_Target_5XX_Count` | Server errors from targets | > 0 = investigate |
| `HTTPCode_ELB_5XX_Count` | Errors generated by ALB itself | > 0 = LB issue |
| `HealthyHostCount` | Number of healthy targets | < min threshold = alert |
| `UnHealthyHostCount` | Number of unhealthy targets | > 0 = alert |
| `ActiveConnectionCount` | Active TCP connections | Capacity planning |
| `NewConnectionCount` | New TCP connections per second | Capacity planning |
| `ProcessedBytes` | Total bytes processed | Cost/capacity monitoring |
| `RuleEvaluations` | Number of rules evaluated | Performance tuning |

### CloudWatch Metrics — NLB

| Metric | Description |
|---|---|
| `ActiveFlowCount` | Active TCP/UDP flows |
| `NewFlowCount` | New flows per second |
| `ProcessedBytes` | Total bytes processed |
| `HealthyHostCount` | Healthy targets |
| `UnHealthyHostCount` | Unhealthy targets |
| `TCP_Client_Reset_Count` | Resets sent from client to target |
| `TCP_Target_Reset_Count` | Resets sent from target to client |
| `TCP_ELB_Reset_Count` | Resets generated by NLB |

### Access Logs

ALB and NLB can log every request to **S3**. Access logs are disabled by default.

```
ALB Access Log Fields (key ones):
  timestamp | elb | client:port | target:port | request_processing_time
  target_processing_time | response_processing_time | elb_status_code
  target_status_code | received_bytes | sent_bytes | request
  user_agent | ssl_cipher | ssl_protocol | target_group_arn
  trace_id | domain_name | chosen_cert_arn | matched_rule_priority
  request_creation_time | actions_executed | redirect_url
  error_reason | target:port_list | target_status_code_list

Enable via:
aws elbv2 modify-load-balancer-attributes \
  --load-balancer-arn <arn> \
  --attributes Key=access_logs.s3.enabled,Value=true \
               Key=access_logs.s3.bucket,Value=my-logs-bucket \
               Key=access_logs.s3.prefix,Value=my-alb
```

### Request Tracing

ALB adds `X-Amzn-Trace-Id` header to every request for distributed tracing with **AWS X-Ray**:

```
X-Amzn-Trace-Id: Root=1-67891233-abcdef012345678912345678

Integrate with X-Ray:
  ALB ──► X-Ray Trace ──► Target (propagates trace ID)
  View full request path in X-Ray Service Map
```

---

## 💰 Pricing Model

ELB pricing has two components: **hourly charge** + **LCU (Load Balancer Capacity Unit)** charge.

### Load Balancer Capacity Units (LCU)

LCUs measure the dimensions on which the load balancer processes your traffic. You are charged for the highest LCU dimension used per hour.

### ALB Pricing Dimensions

| Dimension | 1 LCU = |
|---|---|
| **New connections** | 25 new connections/second |
| **Active connections** | 3,000 active connections/minute |
| **Processed bytes** | 1 GB/hour (EC2/IP targets), 0.4 GB/hour (Lambda) |
| **Rule evaluations** | 1,000 rule evaluations/second |

### NLB Pricing Dimensions

| Dimension | 1 LCU = |
|---|---|
| **New flows** | 800 new TCP flows/second, 400 new UDP flows/second |
| **Active flows** | 100,000 active TCP flows, 200,000 active UDP flows |
| **Processed bytes** | 1 GB/hour |

### Approximate Costs (us-east-1)

| ELB Type | Hourly Rate | LCU Rate |
|---|---|---|
| **ALB** | $0.008/hour | $0.008/LCU-hour |
| **NLB** | $0.008/hour | $0.006/LCU-hour |
| **GWLB** | $0.008/hour | $0.004/LCU-hour |
| **CLB** | $0.025/hour | $0.008/GB processed |

> ⚠️ Prices are approximate. Always check [AWS Pricing](https://aws.amazon.com/elasticloadbalancing/pricing/) for current rates.

### Cost Optimization Tips

```
✓ Delete unused load balancers (hourly charge even with 0 traffic)
✓ Use one ALB with multiple listeners/rules instead of multiple ALBs
✓ Enable Cross-Zone on NLB only if needed (inter-AZ data transfer cost)
✓ Use target group weights for gradual deployments (avoid duplicate LBs)
✓ Monitor LCU metrics to right-size and predict costs
✓ Use AWS Cost Explorer to track ELB spend by tag
```

---

## 🏛️ Advanced Architectural Patterns

### Pattern 1 — Multi-Tier Architecture

```
                    ┌─────────────────────────────────────────────┐
                    │              Multi-Tier App                  │
                    │                                             │
  Internet ────────►│  Internet-Facing ALB                       │
                    │  (Public Subnets, AZ-A + AZ-B)             │
                    │         │                                   │
                    │         ▼                                   │
                    │  Web Tier ASG (Private Subnets)             │
                    │  EC2: Nginx / React / Static                │
                    │         │                                   │
                    │         ▼                                   │
                    │  Internal ALB                               │
                    │  (Private Subnets, AZ-A + AZ-B)            │
                    │         │                                   │
                    │    ┌────┴────┐                              │
                    │    ▼         ▼                              │
                    │  API TG   Auth TG                           │
                    │  (path=/api) (path=/auth)                   │
                    │    │         │                              │
                    │    ▼         ▼                              │
                    │  App Tier ASG (Private Subnets)             │
                    │         │                                   │
                    │         ▼                                   │
                    │  RDS / ElastiCache (Private Subnets)        │
                    └─────────────────────────────────────────────┘
```

### Pattern 2 — Blue/Green Deployment

```
Blue/Green with ALB Weighted Target Groups:
─────────────────────────────────────────────────────────────────
  Phase 1 (Production on Blue):
    ALB Rule → TG-Blue (100%) | TG-Green (0%)

  Phase 2 (Deploy Green, test):
    Deploy new version to TG-Green
    Test via direct target group health checks

  Phase 3 (Canary — 10% to Green):
    ALB Rule → TG-Blue (90%) | TG-Green (10%)
    Monitor error rates, latency

  Phase 4 (Full cutover):
    ALB Rule → TG-Blue (0%) | TG-Green (100%)

  Phase 5 (Rollback if needed):
    ALB Rule → TG-Blue (100%) | TG-Green (0%)
    (Instant — just weight change, no DNS TTL wait)
```

### Pattern 3 — Microservices with ALB

```
Single ALB → Multiple Microservices:
─────────────────────────────────────────────────────────────────
  ALB: api.example.com
    │
    ├── /users/*     → TG-Users-Service    (ECS Fargate)
    ├── /orders/*    → TG-Orders-Service   (ECS Fargate)
    ├── /payments/*  → TG-Payments-Service (ECS Fargate)
    ├── /auth/*      → TG-Auth-Service     (Lambda)
    └── /static/*    → Redirect to S3 URL

Benefits:
  ✓ One ALB = one DNS name = one SSL cert
  ✓ Each service scales independently
  ✓ Path-based routing at Layer 7
  ✓ No service mesh needed for basic routing
```

### Pattern 4 — NLB + ALB Chaining

```
Use case: Need static IP (NLB) + content routing (ALB)
─────────────────────────────────────────────────────────────────
  Client ──► NLB (Static Elastic IP, whitelisted by client firewall)
                  │
                  ▼
             ALB (target type: alb)
                  │
          ┌───────┼───────┐
          ▼       ▼       ▼
        TG-A    TG-B    TG-C
      (path-based routing)

Why: Enterprise clients require fixed IPs for firewall whitelisting
     but you also need ALB's content-based routing capabilities
```

### Pattern 5 — Centralized Security with GWLB

```
Hub-and-Spoke Security Architecture:
─────────────────────────────────────────────────────────────────
  ┌─────────────────────────────────────────────────────────┐
  │  Security VPC (Hub)                                     │
  │  ┌─────────────────────────────────────────────────┐   │
  │  │  GWLB ──► Palo Alto Firewall Fleet (ASG)        │   │
  │  │           (inspect all traffic)                 │   │
  │  └─────────────────────────────────────────────────┘   │
  └─────────────────────────────────────────────────────────┘
           │                    │                    │
    GWLB Endpoint        GWLB Endpoint        GWLB Endpoint
           │                    │                    │
  ┌────────▼──────┐  ┌──────────▼────┐  ┌───────────▼───┐
  │  App VPC A    │  │  App VPC B    │  │  App VPC C    │
  │  (Spoke)      │  │  (Spoke)      │  │  (Spoke)      │
  └───────────────┘  └───────────────┘  └───────────────┘

All traffic from all VPCs passes through centralized firewall
Route tables in each spoke VPC direct traffic to GWLB endpoint
```

---

## 🔑 Key Hacks & Hidden Behaviors

These are the non-obvious behaviors that trip up architects and exam takers alike.

### 1. ELB Subnet Requirements

```
Internet-Facing ALB/NLB:
  ✓ Must be in PUBLIC subnets (with IGW route)
  ✓ Minimum /27 subnet (at least 8 free IPs per AZ)
  ✓ AWS recommends /24 or larger

Internal ALB/NLB:
  ✓ Can be in any subnet (public or private)
  ✓ Same /27 minimum requirement

⚠️  Common mistake: Putting internet-facing ALB in private subnet
    Result: ALB created but unreachable from internet
```

### 2. ELB Does NOT Scale Instantly

```
ELB pre-warms automatically but has limits:
  ✓ Handles gradual traffic increases automatically
  ✗ Sudden massive traffic spikes can overwhelm ELB nodes

Solution for sudden spikes:
  ├── Contact AWS Support to pre-warm ELB (for known events)
  ├── Use CloudFront in front of ALB (absorbs spike at edge)
  └── Use AWS Global Accelerator (anycast routing + pre-warmed)

503 "Service Unavailable" from ELB = No healthy targets
502 "Bad Gateway" from ELB = Target returned invalid response
504 "Gateway Timeout" from ELB = Target didn't respond in time
```

### 3. Idle Timeout

```
ALB Idle Timeout (default: 60 seconds):
  If no data is sent on a connection for 60 seconds → connection closed
  
  Adjust for:
    ├── Long-running requests: Increase to 300–3600s
    ├── WebSocket: Match your WebSocket keepalive interval
    └── File uploads: Set higher than max upload time

aws elbv2 modify-load-balancer-attributes \
  --load-balancer-arn <arn> \
  --attributes Key=idle_timeout.timeout_seconds,Value=300
```

### 4. HTTP to HTTPS Redirect (Free, No Target Needed)

```
ALB can redirect HTTP → HTTPS without a target group:
  Listener: HTTP:80
  Default Action: Redirect to HTTPS:443 (301 Permanent)

This is FREE — no target group, no EC2, no Lambda needed
The ALB itself handles the redirect response

aws elbv2 create-listener \
  --load-balancer-arn <arn> \
  --protocol HTTP --port 80 \
  --default-actions Type=redirect,RedirectConfig="{Protocol=HTTPS,Port=443,StatusCode=HTTP_301}"
```

### 5. ALB Can Return Fixed Responses

```
ALB can return static responses without any backend:
  Use cases:
    ├── Maintenance page (503 with custom HTML)
    ├── Health check endpoint (200 OK)
    └── API versioning (404 for deprecated endpoints)

Rule Action: Fixed Response
  Status Code: 200
  Content-Type: application/json
  Message Body: {"status": "maintenance", "retry_after": 3600}
```

### 6. Target Group Can Have Zero Targets

```
Empty target group behavior:
  ALB: Returns 503 to client
  NLB: Connection times out

Use case: Feature flags — route to empty TG to "disable" a feature
          Gradually drain traffic before decommissioning a service
```

### 7. NLB Preserves Source IP — Security Group Implication

```
⚠️  Critical NLB behavior:
  NLB passes the REAL client IP to targets
  EC2 security groups must allow the CLIENT IP range

  If your EC2 SG only allows the NLB IP → connections will be DROPPED
  (because the packet arrives with the client's IP, not NLB's IP)

  Fix: Allow the client IP range in EC2 SG
  For internet-facing NLB: Allow 0.0.0.0/0 on the target port
  For internal NLB: Allow the VPC CIDR or specific client CIDRs
```

### 8. ALB Desync Mitigation Mode

```
HTTP Desync attacks exploit differences in how HTTP parsers handle
ambiguous requests (HTTP Request Smuggling).

ALB Desync Mitigation Modes:
  ├── Monitor:   Log but allow potentially dangerous requests
  ├── Defensive: Drop ambiguous requests (default, recommended)
  └── Strictest: Drop all non-RFC-compliant requests

aws elbv2 modify-load-balancer-attributes \
  --attributes Key=routing.http.desync_mitigation_mode,Value=defensive
```

### 9. Deletion Protection

```
Enable deletion protection to prevent accidental ELB deletion:
  ✓ Prevents deletion via console, CLI, API
  ✓ Must explicitly disable before deleting

aws elbv2 modify-load-balancer-attributes \
  --attributes Key=deletion_protection.enabled,Value=true

⚠️  CloudFormation stack deletion will FAIL if deletion protection is ON
    Always disable before stack teardown
```

### 10. ELB Access Log Delivery Delay

```
Access logs are delivered to S3 with a delay:
  ALB: Logs delivered every 5 minutes
  NLB: Logs delivered every 5 minutes

⚠️  Access logs are NOT real-time
    For real-time monitoring: Use CloudWatch metrics
    For real-time logging: Use Kinesis Data Firehose via EventBridge
```

---

## 📋 Quick Reference — Exam Cheat Sheet

### ELB Type Selection

| Keyword in Question | Answer |
|---|---|
| "Content-based routing", "path routing", "host routing" | **ALB** |
| "WebSocket", "gRPC", "HTTP/2" | **ALB** |
| "Lambda target", "serverless backend" | **ALB** |
| "Cognito", "OIDC", "authenticate users at LB" | **ALB** |
| "WAF", "web application firewall" | **ALB** |
| "Static IP", "Elastic IP on LB", "whitelist LB IP" | **NLB** |
| "UDP", "DNS load balancing", "gaming", "IoT" | **NLB** |
| "Extreme performance", "millions of requests", "microsecond" | **NLB** |
| "PrivateLink", "VPC endpoint service" | **NLB** |
| "Real client IP on backend natively" | **NLB** |
| "Third-party firewall", "IDS/IPS", "virtual appliance" | **GWLB** |
| "GENEVE protocol", "transparent inspection" | **GWLB** |
| "Legacy", "EC2-Classic", "migrate from CLB" | **CLB → ALB/NLB** |

### Cross-Zone Load Balancing

| | ALB | NLB | GWLB |
|---|---|---|---|
| Default | ON | OFF | OFF |
| Can disable | ❌ | ✅ | ✅ |
| Inter-AZ cost | Free | Charged | Charged |

### SSL/TLS

| | ALB | NLB | CLB |
|---|---|---|---|
| SNI (multiple certs) | ✅ | ✅ | ❌ |
| ACM integration | ✅ | ✅ | ✅ |
| TLS pass-through | ❌ | ✅ | ❌ |
| WAF attachment | ✅ | ❌ | ❌ |

### Health Checks

| | ALB | NLB | GWLB |
|---|---|---|---|
| HTTP/HTTPS | ✅ | ✅ | ✅ |
| TCP | ✅ | ✅ | ✅ |
| gRPC | ✅ | ❌ | ❌ |
| Custom response codes | ✅ | ❌ | ❌ |

### Key Numbers to Remember

| Concept | Value |
|---|---|
| Deregistration Delay default | **300 seconds** |
| Deregistration Delay range | **0 – 3600 seconds** |
| ALB Idle Timeout default | **60 seconds** |
| Slow Start Duration range | **0 – 900 seconds** |
| Minimum subnet size | **/27 (8 free IPs)** |
| Pre-signed URL max (SDK) | **7 days** *(S3, not ELB — don't confuse)* |
| ALB access log delivery | **Every 5 minutes** |
| Rule priority range | **1 – 50,000** |
| Max rules per ALB | **100 rules per listener** |
| Max target groups per ALB | **100** |
| Max targets per target group | **1,000** |

### Common Exam Traps

```
Trap 1: "ALB Cross-Zone can be disabled"
  ❌ Wrong — ALB Cross-Zone is ALWAYS ON and cannot be disabled

Trap 2: "NLB security groups block traffic"
  ❌ Wrong — NLB has NO security groups. Use EC2 SGs and NACLs

Trap 3: "Use ALB for PrivateLink"
  ❌ Wrong — PrivateLink requires NLB as the backend

Trap 4: "CLB supports path-based routing"
  ❌ Wrong — CLB has NO content-based routing

Trap 5: "NLB adds X-Forwarded-For header"
  ❌ Wrong — NLB preserves client IP natively (no header needed)
  ALB adds X-Forwarded-For because it terminates the connection

Trap 6: "Sticky sessions guarantee even distribution"
  ❌ Wrong — Stickiness can cause UNEVEN distribution

Trap 7: "ELB health checks use the same port as traffic"
  ⚠️  Default yes, but you can configure a different health check port
  Common pattern: Traffic on 443, health check on 8080 /health

Trap 8: "Deregistration Delay = Connection Draining"
  ✅ Same concept, different names:
     CLB = "Connection Draining"
     ALB/NLB = "Deregistration Delay"
```

---

## 🗺️ Complete ELB Mental Model

```
┌─────────────────────────────────────────────────────────────────────────┐
│                    ELB COMPLETE MENTAL MODEL                             │
│                                                                         │
│  LAYER 7 (HTTP/HTTPS)          LAYER 4 (TCP/UDP)      LAYER 3+4        │
│  ┌─────────────────┐           ┌─────────────────┐   ┌──────────────┐  │
│  │       ALB       │           │       NLB       │   │    GWLB      │  │
│  │                 │           │                 │   │              │  │
│  │ • Path routing  │           │ • Static IP     │   │ • Appliances │  │
│  │ • Host routing  │           │ • UDP support   │   │ • GENEVE     │  │
│  │ • gRPC/WS       │           │ • Ultra perf    │   │ • Inline     │  │
│  │ • Lambda target │           │ • PrivateLink   │   │   inspect    │  │
│  │ • Cognito auth  │           │ • Real client IP│   │              │  │
│  │ • WAF           │           │ • TLS passthru  │   │              │  │
│  │ • Cross-Zone ON │           │ • Cross-Zone OFF│   │ Cross-Zone   │  │
│  │   (always free) │           │   (charged)     │   │ OFF(charged) │  │
│  └─────────────────┘           └─────────────────┘   └──────────────┘  │
│           │                             │                    │          │
│           └─────────────────────────────┴────────────────────┘          │
│                                         │                               │
│                              ┌──────────▼──────────┐                   │
│                              │    Target Groups     │                   │
│                              │  instance | ip |     │                   │
│                              │  lambda  | alb       │                   │
│                              └──────────┬──────────┘                   │
│                                         │                               │
│                    ┌────────────────────┼────────────────────┐          │
│                    ▼                    ▼                    ▼          │
│               EC2 / ECS            Lambda               On-Prem        │
│               Fargate / EKS        Functions            (via DX/VPN)   │
└─────────────────────────────────────────────────────────────────────────┘
```

---

<p align="center">
  <img src="https://icon.icepanel.io/AWS/svg/Networking-Content-Delivery/Elastic-Load-Balancing.svg" width="60"/>
  <br/>
  <em>Amazon ELB — Distribute traffic intelligently. Build resilient, scalable, secure applications.</em>
</p>

---

### 📚 Series Navigation

| Part | Topics Covered |
|---|---|
| **Part 1** | Architecture, ELB Types (CLB/ALB/NLB/GWLB), DNS→LB→Resources Flow, Listeners & Rules |
| **Part 2** | Cross-Zone LB, Health Checks, Sticky Sessions, SSL/TLS & SNI, Connection Draining, Target Groups |
| **Part 3** | Security, Monitoring, PrivateLink, Pricing, Advanced Patterns, Key Hacks & Exam Cheat Sheet |
