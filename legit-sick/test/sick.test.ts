import { describe, it } from "vitest";

import {
  type CircuitContext,
  QueryContext,
  sampleContractAddress,
  constructorContext,
} from "@midnight-ntwrk/compact-runtime";
import {
  Contract,
  type Ledger,
  ledger,
} from "../contracts/managed/legit-sick/contract/index.cjs";
import {
  NetworkId,
  setNetworkId,
} from "@midnight-ntwrk/midnight-js-network-id";

setNetworkId(NetworkId.Undeployed);

interface LegitSickyState {
  doctor_register: any;
  doctors: any;
  client_records: any;
  ownPublicKey: any;
}

export const randomBytes = (length: number): Uint8Array => {
  const bytes = new Uint8Array(length);
  crypto.getRandomValues(bytes);
  return bytes;
};

const doctor_register = randomBytes(32);
const doctor = randomBytes(32);
const client1 = randomBytes(32);

class LegitSicky {
  readonly contract: Contract<LegitSickyState>;
  circuitContext: CircuitContext<LegitSickyState>;

  constructor() {
    const witnesses = {
      sicky_record: (id, doctor, issued_at, duration_of_certificate) => {
        const sicky = {
          id,
          doctor,
          issued_at,
          duration_of_certificate,
        };

        return sicky;
      },
    };

    this.contract = new Contract<LegitSickyState>(witnesses);

    const {
      currentPrivateState,
      currentContractState,
      currentZswapLocalState,
    } = this.contract.initialState(
      constructorContext({ doctor_register }, "0".repeat(64)),
    );
    this.circuitContext = {
      currentPrivateState,
      currentZswapLocalState,
      originalState: currentContractState,
      transactionContext: new QueryContext(
        currentContractState.data,
        sampleContractAddress(),
      ),
    };
  }

  public getLedger(): Ledger {
    return ledger(this.circuitContext.transactionContext.state);
  }

  public getPrivateState(): LegitSickyState {
    return this.circuitContext.currentPrivateState;
  }

  public add_doctor(_doctor: Uint8Array): Ledger {
    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.add_doctor(
      this.circuitContext,
      {
        bytes: _doctor,
      },
    ).context;

    return ledger(this.circuitContext.transactionContext.state);
  }

  public add_client_record(
    _doctor: Uint8Array,
    _client: Uint8Array,
    id: bigint,
    issued_at: bigint,
    duration_of_certificate: bigint,
  ): Ledger {
    this.circuitContext.currentZswapLocalState = {
      ...this.circuitContext.currentZswapLocalState,
      coinPublicKey: {
        bytes: _doctor,
      },
    };

    // Update the current context to be the result of executing the circuit.
    this.circuitContext = this.contract.impureCircuits.create_client_record(
      this.circuitContext,
      id,
      issued_at,
      duration_of_certificate,
      {
        bytes: _client,
      },
    ).context;

    return ledger(this.circuitContext.transactionContext.state);
  }

  public get_hash(
    _doctor: Uint8Array,
    id: bigint,
    issued_at: bigint,
    duration_of_certificate: bigint,
  ): any {
    return this.contract.circuits.sicky_record_hash(this.circuitContext, {
      id,
      doctor: { bytes: _doctor },
      issued_at,
      duration_of_certificate,
    });
  }
}

describe("Testing legit sick circuits", () => {
  it("should run? ", async () => {
    const legit = new LegitSicky();

    legit.add_doctor(doctor);
    console.log(legit.getLedger().client_records.size());
    legit.add_client_record(doctor, client1, 1n, 100000n, 1000n);

    console.log(legit.getPrivateState());
    console.log(legit.getLedger().client_records.size());

    const hash = legit.get_hash(doctor, 1n, 100000n, 1000n);

    console.log(hash.result);

    console.log(legit.getLedger().client_records.lookup({ bytes: client1 }));
  });
});
