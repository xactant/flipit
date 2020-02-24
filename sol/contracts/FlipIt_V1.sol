pragma solidity >=0.5.16 <0.7.0;

import "../node_modules/openzeppelin-solidity/contracts/math/SafeMath.sol";
import "./Storage.sol";

/**
* Define a games based on flipping a coin. User calls heads or tails.
* If the flip matches cusomter's wager, customer wins wager times defined
* multiplier.
*/
contract  FlipIt_V1 is Storage {
  using SafeMath for uint256;

  function getGameBalance() public view onlyOwner returns(uint256) {
    return _uint256Storage["available_balance"];
  }

  /**
  * Retrieve game statistics.
  */
  function getGameStats() public view returns (uint256, uint256, uint256, uint256, uint256){
    return (_uint256Storage["wagers_made"],
      _uint256Storage["wagers_won"],
      _uint256Storage["amount_wagered"],
      _uint256Storage["amount_paid_out"],
      _uint256Storage["win_multiplyer"]);
  }

  /**
  * Retruns the user's last flip outcome.
  */
  function getPlayerLastTossResult(address player) public view
    returns (uint256, uint256, uint256, bool){
    return (_playerWagers[player].amount,
      _playerWagers[player].payout,
      _playerWagers[player].timestamp,
      _playerWagers[player].win);
  }

  function isAdmin() public view returns(bool) {
    return msg.sender == owner;
  }

  function loadGame() public payable onlyOwner {
      require (msg.value > 0);

      _uint256Storage["available_balance"] =
        _uint256Storage["available_balance"].add(msg.value);
  }

  /**
  * Play a round of the game.
  */
  function toss(uint32 tossCall) public payable {
    // Make sure that players calls either heads or tails.
    require (tossCall == _uint32Storage["heads"] ||
             tossCall == _uint32Storage["tails"], "Call must be heads (0) or tails (1).");

    uint256 time = block.timestamp;
    uint256 wager = msg.value;
    uint256 winning = wager.mul(_uint256Storage["win_multiplyer"]);

    // Make sure the contract can payout before completing toss.
    require(winning < _uint256Storage["available_balance"], "Wager is too large.");

    // Increment call stats
    _uint256Storage["wagers_made"] = _uint256Storage["wagers_made"].add(1);
    _uint256Storage["amount_wagered"] = _uint256Storage["amount_wagered"].add(wager);

    // Player wins only if toss result equals their call.
    if(time % 2 == tossCall) {
      // Increment winning wager stats.
      _uint256Storage["wagers_won"] = _uint256Storage["wagers_won"].add(1);
      _uint256Storage["amount_paid_out"] = _uint256Storage["amount_paid_out"].add(winning);

      _uint256Storage["available_balance"] =
        _uint256Storage["available_balance"].sub(winning);

      // Pay player
      msg.sender.transfer(winning);

      // Store player's latest wager for later lookup.
      _playerWagers[msg.sender] = Wager (
        wager,
        winning,
        time,
        true
      );
    }
    else {
      _uint256Storage["available_balance"] =
        _uint256Storage["available_balance"].add(msg.value);

      _playerWagers[msg.sender] = Wager (
        wager,
        0,
        time,
        false
      );
    }
  }

  /**
  * Provide a way for the owner to reap his / her rewards.
  */
  function withdraw (uint256 amt) public onlyOwner {
      require (amt < _uint256Storage["available_balance"], "Cannot withdraw more than contract balance.");

      _uint256Storage["available_balance"] = _uint256Storage["available_balance"].sub(amt);

      msg.sender.transfer(amt);
  }

  /**
  * Generates a binary (0,1) random value.
  */
  function random () internal view returns (uint) {
    return now % 2;
  }
}
