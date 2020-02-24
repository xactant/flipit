const FlipIt_v1 = artifacts.require("FlipIt_V1");
const FlipIt = artifacts.require("FlipIt");
const truffleAssert = require("truffle-assertions");
const BN = require('bn.js');

var stats = {
  WAGERS_MADE: "0",
  WAGERS_WON: "1",
  AMOUNT_WAGERED: "2",
  AMOUNT_PAID: "3",
  WIN_MULITPLIER: "4",
};

contract("FlipIt_v1", async function(accounts) {
  let instance;

/*
  before(async function(accounts){
    instance = await FlipIt_v1.deployed();

    var proxy = await FlipIt.deployed();
    console.log("Proxy has been deployed, deploying FlipIt ...");
    FlipIt_v1.at(proxy.address).then(function(result){
      console.log("FlipIt instantiated.")
      instance = result;
    });

  });
*/
  it("should initialize statistics properly.",
    async function(){
      let result = await instance.getGameStats();

      assert(result[stats.WAGERS_MADE] == 0, "Wagers made, expected 0.");
      assert(result[stats.WAGERS_WON] == 0, "Wagers won, expected 0.");
      assert(result[stats.AMOUNT_WAGERED] == 0, "Amount wagered, expected 0.");
      assert(result[stats.AMOUNT_PAID] == 0, "Amount paid, expected 0.");
      assert(result[stats.WIN_MULITPLIER] == 2, "Win multiplier, expected 2.");

    }
  );

/*
  it ("should not allow non-owner to check balance",
    async function () {
      await truffleAssert.fails(instance.getBalance( {from: accounts[1]}), truffleAssert.ErrorType.REVERT);
    }
  );
  */
  /*
  it ("should accept and record payment.",
    async function() {
      await instance.send({value: web3.utils.toWei(5, 'ether')});

      var result = instance.getBalance();

      assert(web3.utils.fromWei(result, 'ether').eq(5));
    }
  );
  */
  /*
  _uint256Storage["wagers_made"],
    _uint256Storage["wagers_won"],
    _uint256Storage["amount_wagered"],
    _uint256Storage["amount_paid_out"],
    _uint256Storage["win_multiplyer"]
  */
});
