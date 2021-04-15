export const refreshHomePageItems = async (data) => {

	let body = {}
	for(let param in data.search_params) {
		body[param] = data.search_params[param]
	}
	if(body.category === undefined) {
		alert('Please Choose a Category')
		return
	}
	body['user_id'] = data.currUserId
	body['user_search'] = ''
	console.log('BODY:', body)
	const res = await fetch('http://localhost:5000/api/items-and-services/search', {
		method: 'POST',
		headers: {
			'Content-Type':'application/json'
		},
		body: JSON.stringify(body)
	})

	const items = await res.json()
	return items
}