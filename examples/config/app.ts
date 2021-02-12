import axios from '../../src/index'
import qs from 'qs'
axios.defaults.headers.common['test32'] = 232893478932748237849
axios({
    url: '/config/post',
    method: 'post',
    data: {
            a: 1
    },
    headers: {
        test: '323423'
    }
}).then(res => {
    console.log(res.data);
})





