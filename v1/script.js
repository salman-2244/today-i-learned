const initialFacts = [
    {
      id: 1,
      text: "React is being developed by Meta (formerly facebook)",
      source: "https://opensource.fb.com/",
      category: "technology",
      votesInteresting: 24,
      votesMindblowing: 9,
      votesFalse: 4,
      createdIn: 2021,
    },
    {
      id: 2,
      text: "Millennial dads spend 3 times as much time with their kids than their fathers spent with them. In 1982, 43% of fathers had never changed a diaper. Today, that number is down to 3%",
      source:
        "https://www.mother.ly/parenting/millennial-dads-spend-more-time-with-their-kids",
      category: "society",
      votesInteresting: 11,
      votesMindblowing: 2,
      votesFalse: 0,
      createdIn: 2019,
    },
    {
      id: 3,
      text: "Lisbon is the capital of Portugal",
      source: "https://en.wikipedia.org/wiki/Lisbon",
      category: "society",
      votesInteresting: 8,
      votesMindblowing: 3,
      votesFalse: 1,
      createdIn: 2015,
    },

    {
        id: 4,
        text: "Islamabad is the capital of Pakistan",
        source: "https://en.wikipedia.org/wiki/Islamabad",
        category: "society",
        votesInteresting: 8,
        votesMindblowing: 3,
        votesFalse: 1,
        createdIn: 2015,
      },
];
  
const CATEGORIES = [
    { name: "technology", color: "#3b82f6" },
    { name: "science", color: "#16a34a" },
    { name: "finance", color: "#ef4444" },
    { name: "society", color: "#eab308" },
    { name: "entertainment", color: "#db2777" },
    { name: "health", color: "#14b8a6" },
    { name: "history", color: "#f97316" },
    { name: "news", color: "#8b5cf6" },
];

var btn = document.querySelector(".btn-open");
var form = document.querySelector(".fact-form");
var factList = document.querySelector(".fact-list")

factList.innerHTML = "";


// Loading data from SupaBase

loadFacts();


async function loadFacts() {
    const res = await fetch("https://gzbqsdmcvkecwfeqalea.supabase.co/rest/v1/data", {
    headers :{
        apikey : "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnFzZG1jdmtlY3dmZXFhbGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4Mzk3NDksImV4cCI6MjAxNDQxNTc0OX0._uvDArQqREH6GHjp2ZrnnhCL_eqyFFDAlbmXiKUEV80",
        authorization: "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd6YnFzZG1jdmtlY3dmZXFhbGVhIiwicm9sZSI6ImFub24iLCJpYXQiOjE2OTg4Mzk3NDksImV4cCI6MjAxNDQxNTc0OX0._uvDArQqREH6GHjp2ZrnnhCL_eqyFFDAlbmXiKUEV80",
    },
});
const data = await res.json();
createFactsList(data);
} 


function createFactsList(dataArray)
{
    const htmlArr = dataArray.map((el) => 
    ` <li class="fact"> 
    <p>
         ${el.fact}
        <a class="source" href="${el.source}" target="_blank">(Source)</a>   
    </p>
    <span class="tag" style="background-color: ${CATEGORIES.find((cat) =>
        cat.name  === el.category).color 
        
        }">${el.category}</span>
    </li>`

);
const html = htmlArr.join("");
factList.insertAdjacentHTML("afterbegin", html);
}


// createFactsList(initialFacts);




btn.addEventListener("click", function(){
    if(form.classList.contains("hidden")){
        form.classList.remove("hidden")
        btn.textContent = "Close";
    }
    else{
        form.classList.add("hidden");
        btn.textContent = "Share a fact";



    }
});


