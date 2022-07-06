import { expect } from "chai";
import { ethers } from "hardhat";

describe("Game", function () {
  it("Should init the game", async function () {
    const Game = await ethers.getContractFactory("Game");
    const game = await Game.deploy();
    await game.deployed();

    expect(await game.totalGamesPlayerWon()).to.equal("0");
    expect(await game.totalGamesPlayerLost()).to.equal("0");
  });
});
