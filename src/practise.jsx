import { useEffect, useState } from "react";

const Cards = ({title})=>{
  const [liked,setLiked] = useState(false)
  const [count,setCount] = useState(0)
  useEffect(()=>{
    console.log(`${title}= ${count}`)
  },[liked])
  return (
    <div className="card" onClick={()=>setCount(count+1)}>
      <h2>{title}  {count || null} <br/>
        <button onClick={()=>setLiked(!liked)}>{liked?"❤️":"🤍"}</button>
      </h2>
    </div>
  )
}
function App (){
return (
  <div className="card-container">
    <Cards title = "Avatar"/>
    <Cards title = "Avatar"/>
    <Cards title = "Avatar"/>
  </div>
)
}
export default App;
