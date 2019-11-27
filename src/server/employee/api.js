import axios from 'axios'

  // const api_URL = `http://ec2-3-123-154-0.eu-central-1.compute.amazonaws.com`;
  const api_URL = `http://localhost`;
  export  async function fetchData(id){

    const employeeApiRequest = `${api_URL}/employee?id=${id}`;

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


  
