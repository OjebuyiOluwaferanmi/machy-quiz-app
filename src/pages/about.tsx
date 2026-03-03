{/* import Navigation from "@/components/Navigation"; */}
import Navindex from "@/components/Navindex";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { 
  faBullseye, 
  faBolt, 
  faTrophy, 
  faHeart 
} from '@fortawesome/free-solid-svg-icons';

export default function About() {   
    return (
        <div className="min-h-screen">
          <Navindex />
          <div className="flex flex-col items-center justify-center text-center px-4 gap-8 py-10">
            
            {/* Header */}
            <div>
              <h1 className="text-5xl font-bold text-black mb-4">What is <span className="text-blue-700">MickQz?</span></h1>
              <p className="text-black text-lg max-w-2xl mx-auto">
                <span className="text-blue-700 font-bold">MickQz</span> is a free, interactive quiz platform designed to make learning fun. 
                Whether you're brushing up on general knowledge or challenging your self, we've got you covered.
              </p>
            </div>

            {/* Feature Cards */}
<div className="flex flex-wrap justify-center gap-4 max-w-3xl">
  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5 w-52 text-blue-700">
    <FontAwesomeIcon icon={faBullseye} className="text-3xl mb-2" />
    <h3 className="font-bold text-lg mb-1">Multiple Topics</h3>
    <p className="text-sm text-black">From science to sports, choose any category you love.</p>
  </div>
  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5 w-52 text-blue-700">
    <FontAwesomeIcon icon={faBolt} className="text-3xl mb-2" />
    <h3 className="font-bold text-lg mb-1">Instant Results</h3>
    <p className="text-sm text-black">Get your score immediately after every quiz.</p>
  </div>
  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5 w-52 text-blue-700">
    <FontAwesomeIcon icon={faTrophy} className="text-3xl mb-2" />
    <h3 className="font-bold text-lg mb-1">Difficulty Levels</h3>
    <p className="text-sm text-black">Easy, medium or hard, you pick the challenge.</p>
  </div>
  <div className="bg-white/40 backdrop-blur-sm rounded-xl p-5 w-52 text-blue-700">
    <FontAwesomeIcon icon={faHeart} className="text-3xl mb-2" />
    <h3 className="font-bold text-lg mb-1">100% Free</h3>
    <p className="text-sm text-black">No subscriptions, no hidden fees. Always free.</p>
  </div>
</div>

            <div className="py-5">
              <h1 className="text-5xl font-bold text-black mb-4">Who created <span className="text-blue-700">MickQz?</span></h1>
              <p className="text-black text-lg max-w-2xl mx-auto">
                <span className="text-blue-700 font-bold">MickQz</span> was created by Michael Ojebuyi, a passionate developer and lifelong learner.
                With a love for coding and a desire to make learning accessible, Michael built MickQz to share the joy of quizzing with everyone.
              </p>
            </div>

            

          </div>
        </div>
    );
}