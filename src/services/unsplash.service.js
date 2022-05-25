import axios from 'axios';

export const unsplashService = {
    query
}



async function query(filterBy) {
    const res = await axios({
        method: 'get',
        url: 'https://api.unsplash.com/search/photos',
        params: {
            client_id: 'wfRMyNNl6BtufTtEgOm1agD3oTHPI-ymhw9iJXaCr98',
            query: filterBy,
            page: 1,
            per_page: 20,
            orientation: "landscape",
            w: "2560",
            h: "1560"
        }
    })
    return res.data

}

