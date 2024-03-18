    window.onload = function() {
        const useNodeJS = false;
        const defaultLiffId = "1653746318-A4dwR22z";


        let myLiffId = "";

        if (useNodeJS) {
            fetch('/send-id')
                .then(function(reqResponse) {
                    return reqResponse.json();
                })
                .then(function(jsonResponse) {
                    myLiffId = jsonResponse.id;
                    initializeLiffOrDie(myLiffId);
                })
                .catch(function(error) {
                    document.getElementById("liffAppContent").classList.add('hidden');
                    document.getElementById("nodeLiffIdErrorMessage").classList.remove('hidden');
                });
        } else {
            myLiffId = defaultLiffId;
            initializeLiffOrDie(myLiffId);
        }
    };


    function initializeLiffOrDie(myLiffId) {
        if (!myLiffId) {
            document.getElementById("liffAppContent").classList.add('hidden');
            document.getElementById("liffIdErrorMessage").classList.remove('hidden');
        } else {
            initializeLiff(myLiffId);
        }
    }

    function initializeLiff(myLiffId) {
        liff
            .init({
                liffId: myLiffId
            })
            .then(() => {

                initializeApp();
            })
            .catch((err) => {
                document.getElementById("liffAppContent").classList.add('hidden');
                document.getElementById("liffInitErrorMessage").classList.remove('hidden');
            });
    }

    /**
     * Initialize the app by calling functions handling individual app components
     */
    function initializeApp() {
        displayLiffData();
        displayIsInClientInfo();
        registerButtonHandlers();

        // check if the user is logged in/out, and disable inappropriate button
        if (liff.isLoggedIn()) {
            document.getElementById('liffLoginButton').disabled = true;
        } else {
            document.getElementById('liffLogoutButton').disabled = true;
        }
    }


    function displayLiffData() {
        document.getElementById('isInClient').textContent = liff.isInClient();
        document.getElementById('isLoggedIn').textContent = liff.isLoggedIn();
    }

    /**
     * Toggle the login/logout buttons based on the isInClient status, and display a message accordingly
     */
    function displayIsInClientInfo() {
        if (liff.isInClient()) {
            document.getElementById('liffLoginButton').classList.toggle('hidden');
            document.getElementById('liffLogoutButton').classList.toggle('hidden');
            document.getElementById('isInClientMessage').textContent = 'You are opening the app in the in-app browser of LINE.';
        } else {
            document.getElementById('isInClientMessage').textContent = 'You are opening the app in an external browser.';
        }
    }

    function registerButtonHandlers() {
        document.getElementById('openWindowButton').addEventListener('click', function() {
            liff.openWindow({
                url: 'https://mainhayuk.herokuapp.com/',
                external: true
            });
        });

        document.getElementById('closeWindowButton').addEventListener('click', function() {
            if (!liff.isInClient()) {
                sendAlertIfNotInClient();
            } else {
                liff.closeWindow();
            }
        });
        document.getElementById('liffLoginButton').addEventListener('click', function() {
            if (!liff.isLoggedIn()) {
                liff.login();
            }
        });


        document.getElementById('liffLogoutButton').addEventListener('click', function() {
            if (liff.isLoggedIn()) {
                liff.logout();
                window.location.reload();
            }
        });

        document.getElementById('sendMessageButton').addEventListener('click', function() {
            if (!liff.isInClient()) {
                sendAlertIfNotInClient();
            } else {
                liff.sendMessages([{
                    'type': 'text',
                    'text': "Haloo, Ayo ikutan main game ini line://app/1653746318-A4dwR22z"
                }]).then(function() {
                    window.alert('lihat apa yang anda kirim di kolom chat, terimakasih :)');
                }).catch(function(error) {
                    window.alert('Error sending message: ' + error);
                });
            }
        });
    }