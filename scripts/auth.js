async function checkMail() {
    document.getElementById('errorfield').innerHTML = '';
    let response = await fetch('/mailcheck/' + document.getElementById('mail').value)
    let mailresp = await response.json();
    if (mailresp == 13) {
        document.getElementById('errorfield').innerHTML = '<div class="alert alert-danger mt-2" role="alert">На данную почту уже привязан аккаунт. Введите другой адрес.</div>';
        document.getElementById('sbmbtn').disabled = true;
    }
    if (mailresp == 0) {
        document.getElementById('sbmbtn').disabled = false;
    }
}
async function continueVCode() {
    document.getElementById('errorfield').innerHTML = '';
    let currentVCode = document.getElementById("vcodeinput").value;
    if (currentVCode.length != 6) {
        document.getElementById('errorfield').innerHTML = '<div class="alert alert-danger mt-2" role="alert">Код введён неверно - его размер составляет 6 символов. Попробуйте ещё раз.</div>';
        return 0;
    }
    else {
        let response = await fetch('/reg/' + currentVCode);
        let vcoderesp = await response.json();
        if (vcoderesp == 12) {
            document.getElementById('errorfield').innerHTML = '<div class="alert alert-danger mt-2" role="alert">Код не существует. Попробуйте ещё раз.</div>';
            return 0;
        }
        if (vcoderesp.name) {
            document.getElementById('ptext').innerHTML = 'Добро пожаловать, ' + vcoderesp.name + '! Чтобы завершить регистрацию, введите адрес электронной почты и придумайте надёжный пароль';
            document.getElementById('vcodebtn').innerHTML = '<button type="submit" onclick="" class="btn mb-2 btn-block btn-outline-light" style="font-family: Jost, sans-serif; font-size:2rem" id="sbmbtn">Завершить регистрацию</button>';
            document.getElementById('regforms').innerHTML += '<label class="sr-only" for="inlineFormInputGroup">Электронная почта</label><div class="input-group mb-2"><input type="email" onchange="checkMail()" style="font-size:2rem" class="form-control" name="mail" id="mail" placeholder="Электронная почта" required></div>';
            document.getElementById('regforms').innerHTML += '<label class="sr-only" for="inlineFormInputGroup">Введите пароль</label><div class="input-group mb-2"><input type="password" style="font-size:2rem" class="form-control" name="password1" id="password1" placeholder="Введите пароль" required></div>';
            document.getElementById('vcodediv').innerHTML = '<input type="text" maxlength="6" pattern="^[a-zA-Z0-9]+$" style="font-size:2rem; text-align:center" class="form-control" placeholder="Введите код" id="vcodeinput" name="vcodeinput" readonly="" required>'
            document.getElementById('vcodeinput').value = currentVCode;
            return 0;
        }
    }
}
function vcodechanger() {
    document.getElementById('vcodeinput').value = document.getElementById('vcodeinput').value.toUpperCase();
}