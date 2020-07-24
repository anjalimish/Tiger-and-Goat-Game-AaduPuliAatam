function evaluate(gameState, actions, agentIndex) {
    function Score(score) {
        if (agentIndex == 0)
            return score;
        else return -score;
    }
    if (gameState.Result == 0)
        return Score(10000);
    else if (gameState.Result == 1)
        return Score(-10000);
    else if (gameState.Result == 2)
        return -5000;
    var score = 0;
    var nGoats = gameState.OutsideGoats;
    for (var i = 0; i < gameState.CurrentPosition.length; i++)
        if (gameState.CurrentPosition[i] == 'G')
            nGoats++;
   
    var numCaptures = 0;
      
    score -= 4 * nGoats;
    if (gameState.SideToPlay == 0) { 
        
        score += 2 * numCaptures;
    }
    else { 
        for (var i = 0; i < gameState.CurrentPosition.length; i++) { 
            if (gameState.CurrentPosition[i] == 'T') {
                for (var j = 0; j < MoveActions[i].length; j++)
                    if (gameState.CurrentPosition[MoveActions[i][j]] == 'E')
                        score += 1;
                for (var j = 0; j < CaptureActions.length; j++)
                    if (CaptureActions[j][0] == i && gameState.CurrentPosition[CaptureActions[j][1]] == 'G' && gameState.CurrentPosition[CaptureActions[j][2]] == 'E')
                        score += 2;
            }
        }
    }
    return Score(score);
}
function GameState() {
    this.SideToPlay = 1; 
    this.OutsideGoats = 15;    
    this.CurrentPosition = ['T', 'E', 'E', 'T', 'T', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E', 'E'];
    this.Hash = 0; 
    this.Result = -1; 
}
GameState.prototype.getLegalActions = function () {
    var actions = [];
    if (this.SideToPlay == 1) {
        if (this.OutsideGoats > 0) {
            for (var i = 0; i < this.CurrentPosition.length; i++)
                if (this.CurrentPosition[i] == 'E')
                    actions.push([-1, -1, i]); 
        }
        else {
            for (var i = 0; i < this.CurrentPosition.length; i++) {
                if (this.CurrentPosition[i] == 'G')
                    for (var j = 0; j < MoveActions[i].length; j++)
                        if (this.CurrentPosition[MoveActions[i][j]] == 'E')
                            actions.push([i, -1, MoveActions[i][j]]);
            }
        }
    }
    else {
        for (var i = 0; i < this.CurrentPosition.length; i++) {
            if (this.CurrentPosition[i] == 'T') {
                for (var j = 0; j < CaptureActions.length; j++)
                    if (CaptureActions[j][0] == i && this.CurrentPosition[CaptureActions[j][1]] == 'G' && this.CurrentPosition[CaptureActions[j][2]] == 'E')
                        actions.push(CaptureActions[j]);
                for (var j = 0; j < MoveActions[i].length; j++)
                    if (this.CurrentPosition[MoveActions[i][j]] == 'E')
                        actions.push([i, -1, MoveActions[i][j]]);                
            }
        }
    }
    return actions;
}

GameState.prototype.generateSuccessor = function (action, history) {
    var state = new GameState();
    state.OutsideGoats = this.OutsideGoats;
    state.Result = this.Result;
    state.SideToPlay = (this.SideToPlay + 1) % 2;
    state.CurrentPosition = this.CurrentPosition.slice(0);
    if (action == [0, 0, 0])
        state.Result = state.SideToPlay;
    else {
        if (action[0] == -1) {
            state.OutsideGoats -= 1;
            state.CurrentPosition[action[2]] = 'G';
        }
        else {
            var temp = state.CurrentPosition[action[0]];
            state.CurrentPosition[action[0]] = 'E';
            state.CurrentPosition[action[2]] = temp;
            if (action[1] != -1)
                state.CurrentPosition[action[1]] = 'G';
        }
    }
    var num = state.OutsideGoats;
    for (var i = 0; i < state.CurrentPosition.length; i++)
        if (state.CurrentPosition[i] == "G")
            num += 1;
    if (num == 0)
        state.Result = 0;
    else if (state.getLegalActions().length == 0)
        state.Result = this.SideToPlay;
    
   
    state.Hash = 0;
    for (var i = 0; i < state.CurrentPosition.length; i++) {
        if (state.CurrentPosition[i] == 'T')
            state.Hash += 2;
        else if (state.CurrentPosition[i] == 'G')
            state.Hash += 1;
        state.Hash *= 4;
    }
    state.Hash *= 4;
    state.Hash += state.OutsideGoats;
    state.Hash *= 2;
    state.Hash += state.SideToPlay;
    var numEquals = 0;
      state.Result = 2;
    
    for (var i = history.Pointer - 1; i >= 0; i--) {
        if (history.InternalArray[i].Hash === state.Hash)
            numEquals++;
        if (numEquals > 1) {
            state.Result = 2;
            return state;
        }
    }
    return state;
}


MoveActions = [
    [2, 3, 4, 5],
    [2, 7],
    [0, 1, 3, 8],
    [2, 0, 4, 9],
    [3, 0, 5, 10],
    [0, 4, 11, 6],
    [5, 12],
    [1, 8, 13],
    [2, 7, 14, 9],
    [3, 8, 10, 15],
    [9, 4, 11, 16],
    [5, 12, 10, 17],
    [6, 11, 18],
    [7, 14],
    [13, 8, 15, 19],
    [9, 14, 16, 20],
    [10, 15, 17, 21],
    [16, 11, 18, 22],
    [12, 17],
    [14, 20],
    [15, 19, 21],
    [16, 20, 22],
    [17, 21]
];

CaptureActions = [
    [0, 2, 8],
    [0, 3, 9],
    [0, 4, 10],
    [0, 5, 11],
    [1, 2, 3],
    [1, 7, 13],
    [2, 8, 14],
    [2, 3, 4],
    [3, 9, 15],
    [3, 4, 5],
    [3, 2, 1],
    [4, 3, 2],
    [4, 5, 6],
    [4, 10, 16],
    [5, 4, 3],
    [5, 11, 17],
    [6, 5, 4],
    [6, 12, 18],
    [7, 8, 9],
    [8, 9, 10],
    [8, 2, 0],
    [8, 14, 19],
    [9, 8, 7],
    [9, 10, 11],
    [9, 3, 0],
    [9, 15, 20],
    [10, 4, 0],
    [10, 9, 8],
    [10, 11, 12],
    [10, 16, 21],
    [11, 10, 9],
    [11, 5, 0],
    [11, 17, 22],
    [12, 11, 10],
    [13, 7, 1],
    [13, 14, 15],
    [14, 8, 2],
    [14, 15, 16],
    [15, 14, 13],
    [15, 16, 17],
    [15, 9, 3],
    [16, 15, 14],
    [16, 10, 4],
    [16, 17, 18],
    [17, 16, 15],
    [17, 11, 5],
    [18, 12, 6],
    [18, 17, 16],
    [19, 14, 8],
    [19, 20, 21],
    [20, 15, 9],
    [20, 21, 22],
    [21, 20, 19],
    [21, 16, 10],
    [22, 21, 20],
    [22, 17, 11]
];


Array.prototype.compare = function (array) {
    
    if (!array)
        return false;   
    if (this.length != array.length)
        return false;
    for (var i = 0; i < this.length; i++) {     
        if (this[i] instanceof Array && array[i] instanceof Array) {
          
            if (!this[i].compare(array[i]))
                return false;
        }
        else if (this[i] != array[i]) {           
            return false;
        }
    }
    return true;
}

function HistoryStack(length) {
    this.InternalArray = new Array(length);
    this.Pointer = 0;
}
HistoryStack.prototype.push = function(obj) {
    this.InternalArray[this.Pointer] = obj;
    this.Pointer += 1;
}
HistoryStack.prototype.pop = function () {
    this.Pointer -= 1;
}

function allowDrop(ev) {
    ev.preventDefault();
  }
  
  function drag(ev) {
    ev.dataTransfer.setData("text", ev.target.id);
  }
  
  function drop(ev) {
    ev.preventDefault();
    var data = ev.dataTransfer.getData("text");
    ev.target.appendChild(document.getElementById(data));
  }
