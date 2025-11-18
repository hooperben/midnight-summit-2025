# midnight-summit-2025

My Repo for the MSH 2025

To run the proof server:

```bash
docker run -p 6300:6300 midnightnetwork/proof-server -- 'midnight-proof-server --network testnet'
```

### Core Flow

Here's a sequence diagram of the current flow:

```mermaid
sequenceDiagram
    participant R as Registrar<br/>(Trusted Source)
    participant D as Doctor
    participant C as Client
    participant CR as Certificate<br/>Requestor

    Note over R,D: Step 1: Doctor Registration
    R->>D: Add doctor to register
    activate D
    Note right of D: Doctor is now authorized<br/>to issue certificates
    deactivate D

    Note over D,C: Step 2: Certificate Creation
    C->>D: Request medical certificate
    activate D
    D->>D: Examine client
    D->>C: Create certificate record
    deactivate D
    activate C
    Note right of C: Client now has<br/>certificate on-chain
    deactivate C

    Note over C,CR: Step 3: Selective Disclosure
    CR->>C: Request to view certificate
    activate C
    C->>C: Select which details<br/>to disclose
    C->>CR: Send link with disclosed details
    deactivate C
    Note right of CR: Link contains<br/>selective disclosure proof

    Note over CR: Step 4: View Certificate
    activate CR
    CR->>CR: View disclosed certificate details
    Note right of CR: Requestor sees only<br/>the details client chose<br/>to share
    deactivate CR
```

### Current UI Status

The UI is under development - here is some screenshots:

<details>
  <summary>Home Page</summary>
  <img src="docs/home-page.png" alt="" width="700"/>
</details>

<details>
  <summary>Patient Dashboard</summary>
  <img src="docs/client-page.png" alt="" width="700"/>
</details>

<details>
  <summary>Doctor Dashboard</summary>
  <img src="docs/doc-portal.png" alt="" width="700"/>
</details>

<details>
  <summary>Doctor Create Cert</summary>
  <img src="docs/doc-create-cert.png" alt="" width="700"/>
</details>
