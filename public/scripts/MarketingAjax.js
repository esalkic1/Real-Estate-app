const MarketingAjax = (() => {
    let nekretnineIdsBefore = [];
    let firstResponse;
    let firstCallPretraga = true;
    let firstCallKlik = true;
    // Function to update the number of searches for each nekretnina
    function impl_osvjeziPretrage(divNekretnine) {
        setInterval(() => {
            const nekretnineElements = divNekretnine.querySelectorAll('.nekretnina');
            const nekretnineArray = Array.from(nekretnineElements);

            const allChildren = nekretnineArray.map(nekretnina => nekretnina.children);
    
            const ajax = new XMLHttpRequest();
            ajax.open('POST', `http://localhost:3000/marketing/osvjezi`, true);
            ajax.setRequestHeader('Content-Type', 'application/json');

            ajax.send();
    
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    let response = JSON.parse(ajax.responseText);
                    if(response.nizNekretnina.length == 0 && firstCallPretraga){
                        response = firstResponse;
                        firstResponse.nizNekretnina.forEach(item=>{
                            item.pretrage += 1
                        })
                        firstCallPretraga = false;
                    }
                    response.nizNekretnina.forEach(update => {
                        allChildren.forEach(item => {
                            const match = item[4].id.match(/\d+/);
                            if (match) {
                            const extractedNumber = parseInt(match[0], 10);
                            if(extractedNumber == update.id){
                                item[4].innerHTML = ''
                                item[4].innerHTML = `Broj pretraga: ${update.pretrage}`
                            }
                            } else {
                            console.log("No number found in the input string");
                            }
                        })
                    });
                    // ako ne moze prikazati nikakav broj potrebno je sakriti ovaj div
                    allChildren.forEach(item => {
                        const match = item[4].innerHTML.match(/\d+/);
                        if(!match){
                            item[4].style.display = 'none';
                        }
                    })
                } else if (ajax.readyState == 4) {
                    console.error(`Error updating pretrage: ${ajax.statusText}`);
                }
            };
        }, 500);
    }
    
    
    // Function to update the number of clicks for each nekretnina
    function impl_osvjeziKlikove(divNekretnine) {
        setInterval(() => {
            const nekretnineElements = divNekretnine.querySelectorAll('.nekretnina');
            const nekretnineArray = Array.from(nekretnineElements);

            const allChildren = nekretnineArray.map(nekretnina => nekretnina.children);
    
            const ajax = new XMLHttpRequest();
            ajax.open('POST', `http://localhost:3000/marketing/osvjezi`, true);
            ajax.setRequestHeader('Content-Type', 'application/json');

            ajax.send();
    
            ajax.onreadystatechange = function () {
                if (ajax.readyState == 4 && ajax.status == 200) {
                    let response = JSON.parse(ajax.responseText);
                    if(response.nizNekretnina.length == 0 && firstCallKlik){
                        response = firstResponse;
                        firstCallKlik = false;
                    }
                    response.nizNekretnina.forEach(update => {
                        allChildren.forEach(item => {
                            const match = item[5].id.match(/\d+/);
                            if (match) {
                            const extractedNumber = parseInt(match[0], 10);
                            if(extractedNumber == update.id){
                                item[5].innerHTML = ''
                                item[5].innerHTML = `Broj klikova: ${update.klikovi}`
                            }
                            } else {
                            //console.log("No number found in the input string");
                            }
                        })
                    });
                    // ako ne moze prikazati nikakav broj potrebno je sakriti ovaj div
                    allChildren.forEach(item => {
                        const match = item[5].innerHTML.match(/\d+/);
                        if(!match){
                            item[5].style.display = 'none';
                        }
                    })
                } else if (ajax.readyState == 4) {
                    console.error(`Error updating pretrage: ${ajax.statusText}`);
                }
            };
        }, 500);
    }

    function impl_novoFiltriranje(listaFiltriranihNekretnina) {
        const nizNekretnina = listaFiltriranihNekretnina.map(item => item.id);
        nekretnineIdsBefore = nizNekretnina;

        const ajaxOsvjezi = new XMLHttpRequest();
        ajaxOsvjezi.open('POST', 'http://localhost:3000/marketing/osvjezi', true);
        ajaxOsvjezi.setRequestHeader('Content-Type', 'application/json');
        
        ajaxOsvjezi.send(JSON.stringify({ nizNekretnina }));
        

        ajaxOsvjezi.onreadystatechange = function () {
            if (ajaxOsvjezi.readyState == 4 && ajaxOsvjezi.status == 200) {
                const response = JSON.parse(ajaxOsvjezi.responseText);
                //console.log('Klikovi and pretrage updated successfully', response);
                if(firstCallKlik && firstCallPretraga){
                firstResponse = response;
                }
            } else if (ajaxOsvjezi.readyState == 4) {
                console.error(`Error updating klikovi and pretrage: ${ajaxOsvjezi.statusText}`);
            }
        };

        const ajaxNekretnine = new XMLHttpRequest();
        ajaxNekretnine.open('POST', 'http://localhost:3000/marketing/nekretnine', true);
        ajaxNekretnine.setRequestHeader('Content-Type', 'application/json');

        ajaxNekretnine.send(JSON.stringify({ nizNekretnina }));

        ajaxNekretnine.onreadystatechange = function () {
            if (ajaxNekretnine.readyState == 4 && ajaxNekretnine.status == 200) {
                //console.log('Pretrage updated successfully');
            } else if (ajaxNekretnine.readyState == 4) {
                console.error(`Error updating pretrage: ${ajaxNekretnine.statusText}`);
            }
        };
    }
    function impl_klikNekretnina(idNekretnine) {
        const ajaxOsvjezi = new XMLHttpRequest();
        ajaxOsvjezi.open('POST', 'http://localhost:3000/marketing/osvjezi', true);
        ajaxOsvjezi.setRequestHeader('Content-Type', 'application/json');
    
        ajaxOsvjezi.onreadystatechange = function () {
            if (ajaxOsvjezi.readyState == 4 && ajaxOsvjezi.status == 200) {
                const responseOsvjezi = JSON.parse(ajaxOsvjezi.responseText);
                //console.log('Klikovi and pretrage updated successfully after klikNekretnina', responseOsvjezi);
    
                nekretnineIdsBefore = [idNekretnine];
   
                const ajaxKlikNekretnina = new XMLHttpRequest();
                ajaxKlikNekretnina.open('POST', `http://localhost:3000/marketing/nekretnina/${idNekretnine}`, true);
                ajaxKlikNekretnina.setRequestHeader('Content-Type', 'application/json');
    
                ajaxKlikNekretnina.send(JSON.stringify({ nizNekretnina: [idNekretnine] }));
    
                ajaxKlikNekretnina.onreadystatechange = function () {
                    if (ajaxKlikNekretnina.readyState == 4 && ajaxKlikNekretnina.status == 200) {
                        //console.log(`Klikovi updated successfully for nekretnina with ID ${idNekretnine}`);
                    } else if (ajaxKlikNekretnina.readyState == 4) {
                        console.error(`Error updating klikovi for nekretnina with ID ${idNekretnine}: ${ajaxKlikNekretnina.statusText}`);
                    }
                };
            } else if (ajaxOsvjezi.readyState == 4) {
                console.error(`Error updating klikovi and pretrage after klikNekretnina: ${ajaxOsvjezi.statusText}`);
            }
        };

        ajaxOsvjezi.send(JSON.stringify({ nizNekretnina: [idNekretnine] }));
    }
    
    return {
    osvjeziPretrage: impl_osvjeziPretrage,
    osvjeziKlikove: impl_osvjeziKlikove,
    novoFiltriranje: impl_novoFiltriranje,
    klikNekretnina: impl_klikNekretnina
    };
    })();
    