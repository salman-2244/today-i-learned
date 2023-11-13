import { useEffect, useState } from "react";
import "./style.css";
import supabase from "./supabase"
import React from 'react'

function App() {
  const [showF, showFF] = useState(false);
  const [facts, setFacts] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [currentCategory, setCurrentCategory] = useState('all');

  useEffect(function(){
    async function getFacts(){
    setIsLoading(true);
    let query = supabase.from('facts').select('*')
    if (currentCategory !== 'all')
    query = query.eq("category",currentCategory);

    const {data: facts, error } = await query
    .order("votesInteresting", {ascending: false}).limit(1000);    
    if (!error) setFacts(facts);
    else{
      alert("There is a problem with loading the data");
    }
    setIsLoading(false);
    } 
    getFacts();
  }, [currentCategory]);

  return (
    <>
<Header showF={showF} showFF={showFF}/>
{/* <Counter/> */}
{showF ? <FactForm  setFacts={setFacts}  showFF={showFF}/> : null}

<main className="main">

<CategoryFilter currentCategory={currentCategory} setCurrentCategory={setCurrentCategory}/>
{
  isLoading? (<Loader/> ):
  (
<FactList facts={facts} setFacts={setFacts}/>)
}

</main>

  </> 
  );
}


function Loader() {
return (
  <p className="message">Loading...</p>
);

}

function Header({showF, showFF})
{
  return(
    <header className="header">
    <div className="logo">
    <img src="logo.png" alt="Logo" width="68" height="68"/> 
    <h1>Today I Learned</h1> 
    </div>
    <button className="btn btn-large btn-open" 
    onClick={() =>showFF((showF) => !showF)}>
    
    {showF ? "Close" : "Share a Fact"}</button>
   </header>

  );
}


const CATEGORIES = [
  { name: 'technology', color: '#3b82f6' },
  { name: 'science', color: '#16a34a' },
  { name: 'finance', color: '#ef4444' },
  { name: 'society', color: '#eab308' },
  { name: 'entertainment', color: '#db2777' },
  { name: 'health', color: '#14b8a6' },
  { name: 'history', color: '#f97316' },
  { name: 'news', color: '#8b5cf6' },
];


function isValidHttpUrl(string) {
  let url;
  try {
    url = new URL(string);
  } catch (_) {
    return false;
  }
  return url.protocol === 'http:' || url.protocol === 'https:';
}

function FactForm({setFacts, showFF}){
  const [text, setText] = useState("");
  const [source, setSource] = useState("");
  const [category, setCategory] = useState("");
  const [isUploading, setIsUploading] = useState(false);
  var textLen = text.length;

  async function HandleSubmit(e)
{

  // Not closing the form
  e.preventDefault()
  // console.log(text, source, category);
  // 
  if (text && isValidHttpUrl(source) && category && textLen <= 200)
  {
    // creating new fact object
    // const  newFact = {
    //     id: Math.round(Math.random() * 10000000),
    //     text,
    //     source,
    //     category,
    //     votesInteresting: 0,
    //     votesMindblowing: 0,
    //     votesFalse: 0,
    //     createdIn: new Date().getFullYear(),

    // Uploading Fact to supabase table 
    setIsUploading(true);
    const { data :newFact, error } = await supabase
      .from("facts")
      .insert([
      {text, source, category}
      ])
      .select();
    setIsUploading(false);


        
      // 4. Add the new fact to the UI: add the fact to state
      if (!error) setFacts((facts) => [newFact[0], ...facts]);

      // setting text back to emplty string

      setText('');
      setSource('');
      setCategory('');
      textLen = 0;

      //closing the form
      showFF(false);




  }
}

  return (
  <form className="fact-form" onSubmit={HandleSubmit}>
    <input type="text" placeholder="share a fact with the world"   value={text} onChange={(e)=>setText(e.target.value)} disabled={isUploading}/>
    <span>{200 - textLen}</span>
    <input type="text" placeholder="Trustworthy source"   value={source} onChange={(e) => setSource(e.target.value)} disabled={isUploading}/>
    <select value={category}  onChange={(e) =>(setCategory(e.target.value))} disabled={isUploading}>
        <option value="">Choose a Category</option>
        {CATEGORIES.map((el) => (<option  key={el.name} value= {el.name} >{el.name.toUpperCase()}</option>)
)}
    </select>
    <button className="btn btn-large"  disabled={isUploading}>Post</button>

  </form>
  );
}


function FactList({facts, setFacts}){
  // const temp = initialFacts;
  if (facts.length === 0)
  return  (<p className="message">No facts for this category yet! Create the first one !!</p>);
  
  return( 
  <section>
    <ul className="fact-list">
      {
    facts.map((fact) =>(
      <Fact key = {fact.id} fact = {fact} setFacts={setFacts}/>
      ))
      // setFacts={setFacts}
    }
    <p>There are total {facts.length} facts in our Database</p>

    </ul></section>
  ); 
}



function Fact({fact, setFacts})
{
  const [isUpdating, setIsUpdating] = useState(false);
  const isDisputed = fact.votesInteresting + fact.votesMindblowing < fact.votesFalse;
  async function handleVote(columnName)
  {
    setIsUpdating(true); 
    const { data: updateFact, error } = await supabase
    .from('facts')
    .update({[columnName]: fact[columnName]+ 1 })
    .eq("id", fact.id)
    .select();
    setIsUpdating(false);

    if(!error)
        return setFacts((facts) => facts.map((f)=> (f.id === fact.id ? updateFact[0] : f)));
        
  } 
  return( 
    <li key={fact.id} className="fact">
        <p> 
            {isDisputed ? <span className="disputed">[⛔️DISPUTED]</span> : null}
            {fact.text}
            <a className="source" href={fact.source} target="_blank">(Source)</a>   
        </p> 
        <span className="tag" style={{backgroundColor: CATEGORIES.find((cat) =>
        cat.name  === fact.category).color }}>
          {fact.category}</span>
        <div className="vote-buttons">
            <button onClick={() => handleVote("votesInteresting")} disabled={isUpdating}>👍 {fact.votesInteresting}</button>
            <button onClick={() => handleVote("votesMindblowing")} disabled={isUpdating}>🤯 {fact.votesMindblowing}</button>
            <button onClick={() => handleVote("votesFalse")} disabled={isUpdating}>⛔️ {fact.votesFalse}</button>
        </div>
    </li>

  );
}



function CategoryFilter({currentCategory, setCurrentCategory}){
  return ( 
  <aside>
    <ul>
    { <li className="category"><button className="btn btn-all-categories" onClick={() => setCurrentCategory("all")}>All</button></li> }
      {CATEGORIES.map((cat) => (
        <li key={cat.name} className="category"><button className="btn btn-category"  onClick={() => setCurrentCategory(cat.name)}
        style={{backgroundColor: cat.color}}>{cat.name}</button></li>

      ))}
    </ul>
  </aside> 
  );
}

export default App;
