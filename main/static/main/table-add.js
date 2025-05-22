const add_table = async(url) =>{
    try {
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
    }
    const json = await response.json();
    console.log(json);
    } catch (error) {
    console.error(error.message);
    }
    $('#wrapper-table').load(document.URL + ' #wrapper-table');
    console.log(document.URL + ' #record_table')
}
    


