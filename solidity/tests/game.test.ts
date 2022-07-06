import {
  assert,
  describe,
  clearStore,
  test,
  newMockEvent,
} from "matchstick-as/assembly/index";

import { BetPlaced } from "../generated/Game/Game";
import { Address, BigInt, ethereum } from "@graphprotocol/graph-ts";
import { handleBetPlaced } from "../src/mapping";

function createBetPlacedEvent(
  player: string,
  value: BigInt,
  hasWon: boolean
): BetPlaced {
  const mockEvent = newMockEvent();
  const BetPlacedEvent = new BetPlaced(
    mockEvent.address,
    mockEvent.logIndex,
    mockEvent.transactionLogIndex,
    mockEvent.logType,
    mockEvent.block,
    mockEvent.transaction,
    mockEvent.parameters,
    null
  );
  BetPlacedEvent.parameters = new Array();
  const playerParam = new ethereum.EventParam(
    "player",
    ethereum.Value.fromAddress(Address.fromString(player))
  );
  const valueParam = new ethereum.EventParam(
    "value",
    ethereum.Value.fromUnsignedBigInt(value)
  );
  const hasWonParam = new ethereum.EventParam(
    "hasWon",
    ethereum.Value.fromBoolean(hasWon)
  );

  BetPlacedEvent.parameters.push(playerParam);
  BetPlacedEvent.parameters.push(valueParam);
  BetPlacedEvent.parameters.push(hasWonParam);

  BetPlacedEvent.transaction.from = Address.fromString(player);

  return BetPlacedEvent;
}

describe("handleBetPlaced()", () => {
  test("Should create a new Bet entity", () => {
    const player = "0x7c812f921954680af410d86ab3856f8d6565fc69";
    const hasWon = true;
    const mockedBetPlacedEvent = createBetPlacedEvent(
      player,
      BigInt.fromI32(100),
      hasWon
    );

    handleBetPlaced(mockedBetPlacedEvent);

    const betId =
      mockedBetPlacedEvent.transaction.hash.toHex() +
      "-" +
      mockedBetPlacedEvent.logIndex.toString();

    // fieldEquals(entityType: string, id: string, fieldName: string, expectedVal: string)
    assert.fieldEquals("Bet", betId, "id", betId);
    assert.fieldEquals("Bet", betId, "player", player);
    assert.fieldEquals("Bet", betId, "playerHasWon", "true");
    assert.fieldEquals(
      "Bet",
      betId,
      "time",
      mockedBetPlacedEvent.block.timestamp.toString()
    );
    clearStore();
  });
});
