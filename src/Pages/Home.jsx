
import AdBar from "../components/homepage/AdBar";
import HouseCard from "../components/homepage/HouseCard";
import MainCard from "../components/homepage/MainCard";
import ReasonForCard from "../components/homepage/ReasonForCard";
import RecommandCard from "../components/homepage/RecommandCard"
import Announce from '../components/homepage/Announce'


const Home=()=>{
    return (
        <>
            
            <main>
                <AdBar/>
            </main>
            <HouseCard/>
            <MainCard/>
            <ReasonForCard/>
            <RecommandCard/>
            <Announce/>

        </>
    )
}

export default Home;