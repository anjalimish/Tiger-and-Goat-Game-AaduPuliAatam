
function UpdateUserInterface(result, agentIndex) {
    var side = document.getElementById("SideToMove");
    var reset = document.getElementById("ResetButton");
    var start = document.getElementById("StartButton");
    var outside = document.getElementById("OutSideGoats");
    var status = document.getElementById("Status");
    var gameState = window.currentGameState;
    document.getElementById("MoveBackButton").disabled = (window.MoveHistory.Pointer < 2);
    document.getElementById("MoveForwardButton").disabled = (window.MoveHistory.InternalArray[window.MoveHistory.Pointer] == null);
    document.getElementById("MoveNowButton").disabled = window.currentGameState.SideToPlay != window.ComputerPlaysAs;
    window.selectedId = -1;
    for (var i = 0; i < gameState.CurrentPosition.length; i++) {
        img = document.getElementById(i);
        if (gameState.CurrentPosition[i] == 'G') {
            img.src = "images/Goat.png";
            img.class = "Goat";
        }
        else if (gameState.CurrentPosition[i] == 'T') {
            img.src = "images/Tiger.png";
            img.class = "Tiger";
        }
        else {
            img.src = "images/Empty.png";
            img.class = "Empty";
        }
    }
    outside.innerHTML = gameState.OutsideGoats;
    if (gameState.SideToPlay == 0)
        side.innerHTML = "Tigers";
        if (gameState.Result == 2 && window.isInProgress) {
            status.innerHTML = "In Progress";
            document.getElementById("StopButton").disabled = false;
            document.getElementById("StartButton").disabled = true;
            document.getElementById("ResetButton").disabled = false;
        }
        side.innerHTML = "Goats";    
    if (gameState.Result == -1 && window.isInProgress) {
        status.innerHTML = "In Progress";
        document.getElementById("StopButton").disabled = false;
        document.getElementById("StartButton").disabled = true;
        document.getElementById("ResetButton").disabled = false;
    }
    else {
        document.getElementById("StartButton").disabled = true;
        if (gameState.Result == 0)
            status.innerHTML = "Tigers Win!";
        else if (gameState.Result == 1)
            status.innerHTML = "Goats Win!";
        else if(gameState.Result == 2)
            status.innerHTML = "Draw";
        else {
            status.innerHTML = "Stopped";
            document.getElementById("ComputerSide").disabled = false;
            document.getElementById("StartButton").disabled = false;            
        }
        document.getElementById("StopButton").disabled = true;
    }
}
function ProcessUserInput(element) {
    if (window.isInProgress == true && window.ComputerPlaysAs != 2) {
        if (window.currentGameState.SideToPlay == 1 && window.computerPlaysAs == 0) {
            actions = window.currentGameState.getLegalActions();
            if (actions.length == 0) {
                declareVictory();
                return;
            }
            if (window.currentGameState.OutsideGoats > 0) {
                var isLegal = false;
                for (var i = 0; i < actions.length; i++)
                    if (actions[i].compare([-1, -1, element.id])) {
                        isLegal = true;
                        break;
                    }
                if (isLegal) {
                    window.currentGameState = window.currentGameState.generateSuccessor([-1, -1, element.id], window.MoveHistory);
                    window.MoveHistory.push(window.currentGameState);
                    window.MoveHistory.InternalArray[window.MoveHistory.Pointer] = null;
                    UpdateUserInterface(window.currentGameState);
                    setTimeout(function () { computerPlay(0) });
                }
            }
            else {
                if (element.class == "Goat")
                    window.selectedId = element.id;
                else if (element.class == "Empty") {
                    if (window.selectedId > -1) {
                        var isLegal = false;
                        for (var i = 0; i < actions.length; i++)
                            if (actions[i].compare([window.selectedId, -1, element.id])) {
                                isLegal = true;
                                break;
                            }
                        if (isLegal) {
                            window.currentGameState = window.currentGameState.generateSuccessor([window.selectedId, -1, element.id], window.MoveHistory);
                            window.MoveHistory.push(window.currentGameState);
                            window.MoveHistory.InternalArray[window.MoveHistory.Pointer] = null;
                            UpdateUserInterface(window.currentGameState);
                            setTimeout(function () { computerPlay(0) }, 500);
                        }
                    }
                }
            }            
        }
        else if (window.currentGameState.SideToPlay == 0 && window.computerPlaysAs == 1) {
            actions = window.currentGameState.getLegalActions();
            if (actions.length == 0) {
                declareVictory();
                return;
            }
            if (element.class == "Tiger")
                window.selectedId = element.id;
            else if (element.class == "Empty") {
                if (window.selectedId > -1) {
                    var isLegal = false;
                    var action = [-1, -1, -1];
                    for (var i = 0; i < actions.length; i++)
                        if (actions[i][0] == window.selectedId && actions[i][2] == element.id) {
                            isLegal = true;
                            action = actions[i];
                            break;
                        }
                    if (isLegal) {
                        window.currentGameState = window.currentGameState.generateSuccessor(action, window.MoveHistory);
                        window.MoveHistory.push(window.currentGameState);
                        window.MoveHistory.InternalArray[window.MoveHistory.Pointer] = null;
                        UpdateUserInterface(window.currentGameState);
                        setTimeout(function () { computerPlay(1) }, 500);
                    }
                }
            }
            
        }
    }
    function declareVictory() {
        window.isInProgress = false;
        
        UpdateUserInterface();
    }
}
function computerPlay(agentIndex) {
 
    var agentName;
    window.AgentTerminated = false;
    document.getElementById("MoveNowButton").disabled = false;
    var currentScore, currentDepth, currentAction, currentProgress, depthLimit, timeLimit, nodesExpanded;
    var output = document.getElementById("output");
    if (agentIndex == 0) {        
        currentScore = document.getElementById("TigersCurrentScore");     
        currentProgress = document.getElementById("TigersCurrentProgress");       
    }
    else {       
        currentScore = document.getElementById("GoatsCurrentScore");        
        currentProgress = document.getElementById("GoatsCurrentProgress");              
    }
  
 
    window.AgentTimers = new Array(3);
    var startTime = new Date().getTime() / 1000;
 
    window.AgentTimers[0] = setInterval(function () {
        if (!window.AgentTerminated) {
            if (window.AgentResult != null) {
                var value = Math.max(Number(window.AgentResult[2]) / depthLimit * 100, ((new Date().getTime()/1000) - startTime) / timeLimit * 100);
                currentProgress.value = value;
            }
        }
    }, 1000);
    
    window.AgentTimers[2] = setInterval(function () {
        if (window.AgentTerminated) {
            for (var i = 0; i < window.AgentTimers.length; i++)
                clearTimeout(window.AgentTimers[i]);
            if (window.isInProgress) {
                if (window.AgentResult == null) {
                    resetGame();
                    return;
                }
                window.currentGameState = window.currentGameState.generateSuccessor(window.AgentResult[1], window.MoveHistory);
                window.MoveHistory.push(window.currentGameState);
                window.MoveHistory.InternalArray[window.MoveHistory.Pointer] = null;
                if (window.currentGameState.Result != -1) {
                    window.isInProgress = false;
                    window.AgentTerminated = true;
                    window.AgentWorker.terminate();
                }
                document.getElementById("MoveNowButton").disabled = true;
            }
            UpdateUserInterface();
            if (window.isInProgress && window.computerPlaysAs == 2)
                computerPlay(window.currentGameState.SideToPlay);
        }
    }, 300);
}
function moveNow() {
    window.isInProgress = true;
    var cmpside = document.getElementById("ComputerSide");
    cmpside.disabled = true;
    if (cmpside.options[cmpside.selectedIndex].value == "goats") {
        window.computerPlaysAs = 2;
        UpdateUserInterface();
        if (window.currentGameState.SideToPlay == window.computerPlaysAs)
            computerPlay(window.currentGameState.SideToPlay);
    }
    else if (cmpside.options[cmpside.selectedIndex].value == "tigers") {
        window.computerPlaysAs = 0;
        UpdateUserInterface();
        if (window.currentGameState.SideToPlay == window.computerPlaysAs)
            computerPlay(window.currentGameState.SideToPlay);
    }
    else {
        window.computerPlaysAs = 3;
        UpdateUserInterface();
        computerPlay(window.currentGameState.SideToPlay);
    }
}
function stopGame() {
    window.isInProgress = false;
    if (!window.AgentTerminated) {
        window.AgentTerminated = true;
        
    }
    UpdateUserInterface();
}
function moveBack() {
    window.isInProgress = false;
    if (!window.AgentTerminated) {
        window.AgentTerminated = true;
        
    }
    if (window.MoveHistory.Pointer > 1) {
        window.currentGameState = window.MoveHistory.InternalArray[window.MoveHistory.Pointer - 2];
        window.MoveHistory.Pointer--;
    }
    UpdateUserInterface();
}
function moveForward() {
    window.isInProgress = true;
    if (!window.AgentTerminated) {
        window.AgentTerminated = true;
        window.AgentWorker.terminate();
    }
    var state = window.MoveHistory.InternalArray[window.MoveHistory.Pointer];
    if (state != null) {
        window.currentGameState = state;
        window.MoveHistory.Pointer++;
    }
    UpdateUserInterface();
}


function startGame() {
    window.isInProgress = true;
    var cmpside = document.getElementById("ComputerSide");
    cmpside.disabled = true;
    if (cmpside.options[cmpside.selectedIndex].value == "goats") {
        window.computerPlaysAs = 1;
        UpdateUserInterface();
        if (window.currentGameState.SideToPlay == window.computerPlaysAs)
            computerPlay(window.currentGameState.SideToPlay);
    }
    else if (cmpside.options[cmpside.selectedIndex].value == "tigers") {
        window.computerPlaysAs = 0;
        UpdateUserInterface();
        if (window.currentGameState.SideToPlay == window.computerPlaysAs)
            computerPlay(window.currentGameState.SideToPlay);
    }
    else {
        window.computerPlaysAs = 2;
        UpdateUserInterface();
        computerPlay(window.currentGameState.SideToPlay);
    }
}
function resetGame() {
    setTimeout(function () {
        if (window.AgentWorker != null) {
            window.AgentTerminated = true;
            window.AgentWorker.terminate();
        }
        if (window.AgentTimers != null) {
            for (var i = 0; i < window.AgentTimers.length; i++)
                clearTimeout(window.AgentTimers[i]);
        }
        window.selectedId = -1;
        window.isInProgress = false;
        window.currentGameState = new GameState();
        window.MoveHistory = new HistoryStack(500);
        document.getElementById("StartButton").disabled = false;
        
        UpdateUserInterface();
    }, 0);
}