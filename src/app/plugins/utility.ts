export const getQueryValue = (key:string)=> {
  for (const set of location.search.replace('?', '').split('&')){
    const [id, value] = set.split('=');
    if(id===key){
      return value
    }
  }
  return null
}
