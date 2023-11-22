import React,{useState} from "react";
import{v4 as uuidV4} from "uuid";
import toast from "react-hot-toast";
import {useNavigate} from 'react-router-dom';

const Home = () => {

  const navigate= useNavigate();
  const [roomId, setRoomId]=useState('');
  const [username, setUsername]=useState('');

  const createNewRoom=(e) =>{
    e.preventDefault();
    const id = uuidV4();
    setRoomId(id);
    toast.success('Created a new Room');
  }

  const joinRoom = ()=>{

    if(!roomId || !username){
      toast.error('ROOM ID  and Username is required');
      return
    }

  navigate(`/editor/${roomId}`,{
      state:{
        username,
        roomId,
      },
    });

  };

  const handleEnterkey = (e) => {
    if(e.code == 'Enter'){
      joinRoom();
    }
  };

  return(
    <div className="homePageWrapper">
      <div className="formWrapper">

        <img src="code5.png" id="formImage" className="newPicture"/>
        <h4 className="formLabel">Paste Invitation ROOM ID</h4>

        <div className="formGroup">
          <input type="text" className="formInput" placeholder="ROOM ID"value={roomId} onChange={(e) => setRoomId(e.target.value)} onKeyUp={handleEnterkey}/>

          <input type="text" className="formInput" placeholder="Full Name" value={username} onChange={(e) => setUsername(e.target.value)} onKeyUp={handleEnterkey}/>

          <input type="button" className="btn formButton" value="Join" onClick={joinRoom}/>

          <span className="formInfo">
            If you dont have ROOM ID then create one &nbsp;
            <a onClick={createNewRoom} href="" className="forNewRoom">New Room</a>

          </span>
        </div>
      </div>
      <footer>
          Build with ❤️ by <a href="https://github.com/harshkadam82">Harsh</a>
      </footer>
    </div>
  );

};

export default Home;