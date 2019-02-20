function open_shop(){
    var popup = document.getElementById('popups-shop');
    popup.style.visibility = 'visible';
}

function open_balance(){
    var popup = document.getElementById('popups-balance');
    popup.style.visibility = 'visible';
}

function close_shop(){
    var popup = document.getElementById('popups-shop');
    popup.style.visibility = 'hidden';
}

function close_balance(){
    var popup = document.getElementById('popups-balance');
    popup.style.visibility = 'hidden';
}

function goBackYard(){
    var mainleft = document.getElementById('main-left');
    var mainright = document.getElementById('main-right');
    mainleft.style.visibility = 'hidden';
    mainright.style.visibility = 'hidden';
    var backyard = document.getElementById('Backyard');
    backyard.style.visibility = 'visible';
}

function gohome(){
    var mainleft = document.getElementById('main-left');
    var mainright = document.getElementById('main-right');
    mainleft.style.visibility = 'visible';
    mainright.style.visibility = 'visible';
    var backyard = document.getElementById('Backyard');
    backyard.style.visibility = 'hidden';
}
let ClaimCountDown = 1000;
function Claim(){
    var claimbut = document.getElementById('claimhere');
    claimbut.style.background = 'transparent';
    claimbut.style.color = 'red';
    claimbut.style.borderColor = 'black';
    claimbut.textContent = ClaimCountDown;
}