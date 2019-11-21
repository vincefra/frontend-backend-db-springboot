import axios from 'axios'

  const api_URL = `http://localhost:7878/`;
  export  async function fetchData(id){

    const employeeApiRequest = `${api_URL}/api/employee?id=${id}`;

        const options = {
            url: employeeApiRequest,
            responseType: "json",
            method: 'GET',
          };
        
          let response;
          try {
            response = await axios(options);
          } catch (error) {
            return {};
          }
        if(response.status === 200){
            return response.data;
        }
    }


  