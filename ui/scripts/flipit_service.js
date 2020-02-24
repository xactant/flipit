/**
* The flipitservice module provides an insterface to the
* FlipIt contract.
*
* TODO Add better exception handling, web3 and contract
* state checking.
*/
var flipitService = function () {
  //  Indicate that module has been initialized.
  var isInitialized = false;
  // Web3 instance.
  var web3 = new Web3(Web3.givenProvider);
  // Contract instance
  var contractInstance = null;

  var playerAccount = '';

  // Fast way to identify game stat results.
  var statfields = {
    WAGERS_MADE: "0",
    WAGERS_WON: "1",
    AMOUNT_WAGERED: "2",
    AMOUNT_PAID: "3",
    WIN_MULITPLIER: "4",
  };
  // Provide player's available choices.
  winchoices = {
    HEADS: 0,
    TAILS: 1
  };

  /**
  * Wait for Web3 to be start and retrieve an instance of
  * the FlipIt contract
  */
  function initializeService () {
    console.log('flipitService.initializeService called ...');
    return window.ethereum.enable()
    .then(function(accounts) {
      playerAccount = accounts[0];
      contractInstance = new web3.eth.Contract(abi, contractAddress, {from: playerAccount});
      console.log(contractInstance);
      isInitialized = true;
    });
  }

  /**
  * Send player's prediction and wager to the contract.
  * TODO replace alerts with notifications
  * TODO Maybe split post processing between events - is this necessary?
  * @param winChoice - player's prediction should be 0 (heads) or 1 (tails)
  * @param wager - amount player wagers on this toss.
  * @param dem - denomination of wager (valid web3 eth denominations: qwei,
  *              finney, ether, etc.)
  * @param callback - method to call when contract call completes.
  */
  function doToss (winChoice, wager, dem, callback) {
    console.log('flipitService.doToss called ...');
    if (winchoices.HEADS != winChoice &&
        winchoices.TAILS != winChoice) {
      alert ('Must choose heads or tails.');
      return null;
    }

    if (isInitialized) {
      var config = {
        from: playerAccount,
        value: dem == 'wei'? dem : web3.utils.toWei(wager, dem)
      };

      contractInstance.methods.toss(parseInt(winChoice))
        .send(config, callback)
        .on("transactionHash", function(hash) {
          console.log('transactionHash: ' + hash);
        })
        .on("confirmation", function(confNum) {
          console.log('confNum: ' + confNum);
        })
        .on("receipt", function(receipt){
          console.log('receipt: ' + receipt);
        });
    }
    else {
      console.error ('Module flipitService is not initialized.');
    }
  }

  function getBalance () {
    console.log("retrieving new balanace ...");

    return web3.eth.getBalance(contractAddress).call()
      .then(function (result) {
        return result;
      }
    );
  }

  /**
  * Retrieves the current game statistics values.
  */
  function getGameStats() {
    console.log('flipitService.getGameStats called ...');
    if (isInitialized) {
      return contractInstance.methods.getGameStats().call()
        .then(function (result) {
          return {
            wagersMade: result[statfields.WAGERS_MADE],
            wagersWon: result[statfields.WAGERS_WON],
            amountWagered: web3.utils.fromWei(result[statfields.AMOUNT_WAGERED], "ether"),
            amountPaid: result[statfields.AMOUNT_PAID],
            winMultiplier: result[statfields.WIN_MULITPLIER],
          };
        }
      );
    }
    else {
      console.error ('Module flipitService is not initialized.');
    }
  }

  /**
  * Retrieves the results of the last toss for the current user.
  */
  function getLastToss () {
    console.log('flipitService.getLastToss called ... ' + playerAccount);
    if (isInitialized) {
      return contractInstance.methods
        .getPlayerLastTossResult(playerAccount).call()
        .then(function (result) {
          return {
            amount: result[0],
            payout: result[1],
            timestamp: new Date(result[2]),
            win: result[3]
          };
        }
      );
    }
    else {
      console.error ('Module flipitService is not initialized.');
    }
  }

  function isAdmin () {
    return contractInstance.methods.isAdmin().call()
      .then(function (result) {
        return result;
      }
    );
  }

  function loadGame(amt, callback) {
    var config = {
      from: playerAccount,
      value: web3.utils.toWei(amt, "ether")
    };

    contractInstance.methods.loadGame()
      .send(config, callback)
      .on("transactionHash", function(hash) {
        console.log('transactionHash: ' + hash);
      })
      .on("confirmation", function(confNum) {
        console.log('confirmation: ' + confNum);
      })
      .on("receipt", function(receipt){
        console.log('receipt: ' + receipt);
        //callback();
      });
  }

  function withdraw (amt, callback) {
    var config = {
      from: playerAccount
    };

    contractInstance.methods.withdraw(web3.utils.toWei(amt, "ether"))
      .send(config, callback)
      .on("transactionHash", function(hash) {
        console.log('transactionHash: ' + hash);
      })
      .on("confirmation", function(confNum) {
        console.log('confirmation: ' + confNum);
      })
      .on("receipt", function(receipt){
        console.log('receipt: ' + receipt);
      });
  }

  return {
    gameStats: getGameStats,
    getBalance: getBalance,
    init: initializeService,
    isAdmin: isAdmin,
    lastToss: getLastToss,
    loadGame: loadGame,
    doToss: doToss,
    web3: web3,
    winChoices: winchoices,
    withdraw: withdraw
  };
}();
