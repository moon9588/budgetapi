
let db;
const request = indexedDb.open('potato_PWA', 1);
request.onupgradeneeded = function (event) {
    const db = event.target.results;
    db.createdObjectStore('new_transaction', { autoIncrement: true});

};

request.onsuccess = function(event){
    db = event.target.results;
    if (navigator.online) {
       uploadTrasaction();    
    }
};

request.onerror = function(event){
    console.log(event.target.errorCode);
};

function saveRecord(record){
    const transaction = db.transaction(['new_transaction'], 'readwrite');

const budgetObjectStore = transaction.objectStore('new_transcation');
budgetObjectStore.add (record);

alert('New purchase has been added to the budget!');
}

function uploadTrasaction(){
    const transaction = db.transaction(['new_transcation'], 'readwrite');
    const budgetObjectStore = transaction.objectStore('new_transcation');
    const getAll = budgetObjectStore.getAll();

    getAll.onsuccess = function (){
        if (getAll.results.length >0){
            fetch('/api/transcation',{
                method: 'POST',
                body: JSON.stringify(getAll.results),
                headers: {
                    Accept: 'application/json, text/plain, */*',
                    'Content-type': 'application/json'
                }
            })
            .then(response => response.json())
            .then(serverResponse => {
                if (serverResponse.message){
                    throw new Error(serverResponse);
                }
                const transaction = db.transaction(['new_transcation'],'readwrite');
                const budgetObjectStore = transcation.objectStore ('new_transaction');
                budgetObjectStore.clear ();
                alert('All transcations made have been successfully submitted!');
            })
            .catch(err => {
                console.log(err);
            })
        }
        
    }
}

window.addEventListener('online',uploadTrasaction);