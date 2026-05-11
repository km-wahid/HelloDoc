# Security Specification: Nexus Health Systems

## Data Invariants
1. A user profile MUST match the `uid` of the authenticated user.
2. The `role` field is immutable after initial creation.
3. The `email` field must match the authenticated user's email.
4. Timestamps MUST be server-generated (`request.time`).

## The Dirty Dozen Payloads (Identified Attacks)

### 1. Identity Spoofing (Write to another UID)
```json
{ "uid": "victim_id", "email": "attacker@nexus.com", "role": "doctor" }
```
- **Target Path**: `/users/victim_id`
- **Expected Result**: `PERMISSION_DENIED`

### 2. Privilege Escalation (Self-promote to Doctor)
```json
{ "role": "doctor" }
```
- **Target Path**: `/users/patient_id` (Update)
- **Expected Result**: `PERMISSION_DENIED`

### 3. Resource Poisoning (Massive document ID)
- **Target Path**: `/users/very-long-string-over-128-chars...`
- **Expected Result**: `PERMISSION_DENIED`

### 4. Shadow Field Injection
```json
{ "name": "Hack", "isVerified": true }
```
- **Target Path**: `/users/my_id` (Update)
- **Expected Result**: `PERMISSION_DENIED` (hasOnly check failed)

### 5. Email Hijacking
```json
{ "email": "admin@hospital.com" }
```
- **Target Path**: `/users/my_id` (Update)
- **Expected Result**: `PERMISSION_DENIED` (Email is immutable)
