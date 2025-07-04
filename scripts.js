
    function menu(){
    const nav=document.getElementById("nav");
    if(nav.style.margin=='0% -15%'){
      nav.style.margin='0% 0%'
    }
    else{
      nav.style.margin='0% -15%'
    }
   
  }
  
  function buy(){
    const buy=document.getElementById("container")
    buy.style.display='block'
    
    document.getElementById("home").style.display='none'
    document.getElementById("store").style.display='none'
  }
  
  function home(){
    document.getElementById("container").style.display='none'
    document.getElementById("home").style.display='block'
    document.getElementById("cont").style.display='none'

  }
 
  