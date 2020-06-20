function fetchData() {
    let data = new URLSearchParams();
    data.append('input', document.getElementById('input').value);
    fetch('/api/convert/?' + data.toString(), {method: 'get'}).then(res => res.json()).then(obj => {
        console.log(obj);
        if (obj.hasOwnProperty('error')) document.getElementById('output').innerHTML = "<p>" + document.getElementById('input').value + ' - ' + obj['error'] + "</p>";
        else document.getElementById('output').innerHTML = "<p>" + obj['string'] + "</p>";
        document.getElementById('input').value = '';
    });
    return false;
}