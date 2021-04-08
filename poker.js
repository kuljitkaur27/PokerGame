const fs = require('fs');

const Result = { "player1Count": 0, "player2Count": 0 , "tie": 0};

const pokerCards = [ 'A','2', '3', '4', '5', '6', '7', '8', '9', 'T', 'J', 'Q', 'K'];

const ranks = [
    'High card',
    'Pair',
    'Two pairs',
    'Three of a kind',
    'Straight',
    'Flush',
    'Full house',
    'Four of a kind',
    'Straight flush',
    'Royal flush',
   ]

const pokerHand = function(hand) {
    this.hand = hand;
    this.conditions = {
        'numberCount': Helper.numberCount(hand),
        'consecutiveNumbers': Helper.consecutiveNumbersCheck(hand),
        'sameSuits': Helper.sameSuitsCheck(hand),
        'highCardIndex': pokerCards.indexOf(Helper.getHighCard(hand))
    };
};


pokerHand.prototype.compareWith = function(hand) {

    const player1 = new pokerHand(this.hand);
    const player2 = hand;

    // Get index of result in ranks (lower score better)
    const p1Result = ranks.indexOf(Helper.getResult(player1));
    const p2Result = ranks.indexOf(Helper.getResult(player2));

    // If both players only have high card, compare cards
    if(p1Result === 1 && p2Result === 1) {
        if(player1.conditions.highCardIndex > player2.conditions.highCardIndex) {
            return ++Result.player1Count;
        } else if(player1.conditions.highCardIndex < player2.conditions.highCardIndex) {
            return ++Result.player2Count;
        } else {
            return ++Result.tie;
        }

    // Else compare ranks index (lower score wins)
    } else if(p1Result < p2Result) {
        return ++Result.player1Count;
    } else if (p1Result > p2Result) {
        return ++Result.player2Count;;
    } else if (p1Result === p2Result) {
        return ++Result.tie
    } else {
        return;
    }
};



const Helper = {
    numberCount: (hand)  => {
        let cardDenoms = {};

        cardNumbers.getHandDenominations(hand).map(ele => {
            if (pokerCards.includes(ele)) {
                typeof cardDenoms[ele] === "undefined"
                    ? (cardDenoms[ele] = 1)
                    : cardDenoms[ele]++;
            }
        });
        return cardDenoms;
    },

    consecutiveNumbersCheck: (hand)  => {
        let indexes = [];
        let consecutiveNumbers = true;

        cardNumbers.getHandDenominations(hand).map(ele => {
            indexes.push(pokerCards.indexOf(ele));
        });

        const sortedIndexes = indexes.sort((a, b) => a - b);

        for (let i = 1; i < sortedIndexes.length; i++) {
            if (sortedIndexes[i - 1] != sortedIndexes[i] - 1) {
                consecutiveNumbers = false;
            }
        }
        return consecutiveNumbers;
    },

    sameSuitsCheck: (hand) => {
        const suitsInHand = cardNumbers.getHandSuits(hand);
        const suit = suitsInHand.shift();
        let count = 0;

        suitsInHand.map(ele => {
            if (ele === suit) {
                count++;
            }
        });

        return count === 4 ? true : false;
    },
    getHighCard: (hand) => {
        let highIndex = 0;

        cardNumbers.getHandDenominations(hand).map(ele => {
            if (pokerCards.indexOf(ele) > highIndex) {
                highIndex = pokerCards.indexOf(ele);
            }
        });

        return pokerCards[highIndex];
    },
    getResult: (hand) => {
        const denoms = cardNumbers.getHandDenominations(hand.hand);

        // Royal flush         A => 10 same suit
        if (
            denoms.includes("A") &&
            hand.conditions.consecutiveNumbers &&
            hand.conditions.sameSuits
        ) {
            return ranks[10];
        }

        // Straight flush      5 consecutive numbers same suit
        if (hand.conditions.consecutiveNumbers && hand.conditions.sameSuits) {
            return ranks[9];
        }

        // Four of a kind      Four cards the same
        let duplicates = [];

        for (const prop in hand.conditions.numberCount) {
            if (hand.conditions.numberCount[prop] === 4) {
                return ranks[8];
            } else {
                duplicates.push(hand.conditions.numberCount[prop]);
            }
        }

        // Full house          3 cards same denomination + a pair
        if (
            (duplicates[0] === 3 && duplicates[1] === 2) ||
            (duplicates[1] === 3 && duplicates[0] === 2)
        ) {
            return ranks[7];
        }

        // Flush               5 cards same suit
        if (hand.conditions.sameSuits) {
            return ranks[6];
        }

        // Straight            Any 5 cards in sequence
        if (hand.conditions.consecutiveNumbers) {
            return ranks[5];
        }

        // Three of a kind     3 cards same denomination
        for (const prop in hand.conditions.numberCount) {
            if (hand.conditions.numberCount[prop] === 3) {
                return ranks[4];
            }
        }

        // Two pairs           2 sets of 2 cards same denomination
        // One Pair            2 cards same denomination
        let pairs = [];
        denoms.map((ele, i) => {
            if (denoms[i] === denoms[i + 1]) {
                pairs.push(denoms[i]);
            }
        });

        if (pairs.length === 2) {
            return ranks[3];
        } else if (pairs.length === 1) {
            return ranks[2];
        }

        // High card           Highest card if no other combination
        return ranks[1];
    }
};


/* FUNCTIONS */

const cardNumbers = {
    // Get card numbers contained in hand
getHandDenominations: (cards) => {
    return cards.map(ele => ele[0]).sort();
},

// Get suits contained in hand
getHandSuits: (cards) => {
    return cards.map(ele => ele[1]).sort();
}

}


try {
  const data = fs.readFileSync('poker-hands.txt', 'utf8');
  const lines = data.split(/\r?\n/);

  // print all lines
  lines.forEach((line) => {
      
        const cards = line;

        let playerOneHand, playerTwoHand, playerOneValue, playerTwoValue;
        const cardsArray = cards.split(" ");

        playerOneValue = cardsArray.slice(0,5);
        playerTwoValue = cardsArray.slice(5,10);

        if (playerOneValue.length !== 0 && playerTwoValue.length !== 0) {
        playerOneHand = new pokerHand(playerOneValue);
        playerTwoHand = new pokerHand(playerTwoValue);

        playerOneHand.compareWith(playerTwoHand);
        

    }
  });
    console.log("Player1 : ", Result.player1Count);
    console.log("Player2 : ",Result.player2Count);
    console.log("Tie     : ",Result.tie);
} catch (err) {
  console.error(err);
}

