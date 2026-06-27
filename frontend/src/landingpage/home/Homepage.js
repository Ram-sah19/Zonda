import React from 'react';
import Hero from './Hero';
import Brand from './Brand';
import Feature from './Feature';
import Interesting from './Interesting';
import Suggest from './Suggest';

function Homepage() {
    return ( 
        <>      
            <Hero />
            <Brand />
            <Feature activeCategory="all" />
            <Interesting />
            <Suggest />
        </>
     );
}

export default Homepage;