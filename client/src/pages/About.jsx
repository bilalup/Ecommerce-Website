import TeamMember from "../Components/TeamMember";

const About = () => {
  const teamMembers = [
    { 
      id: 1, 
      name: 'Bilal Siraj',
      role: 'Founder & CEO', 
      bio: 'Fashion enthusiast with 10+ years of experience in the industry.'
    },
    { 
      id: 2, 
      name: ' Bilal Siraj', 
      role: 'Head of Design', 
      bio: 'Creative director with a passion for sustainable fashion.',
    },
    { 
      id: 3, 
      name: 'Abdu', 
      role: 'Marketing Director', 
      bio: 'Digital marketing expert focused on brand storytelling.',
    },
    { 
      id: 4, 
      name: 'joan', 
      role: 'Customer Experience', 
      bio: 'Dedicated to creating exceptional shopping experiences.',
    }
  ];

  return (
    <div className="pt-24 pb-16">
      {/* Hero Section */}
      <section className="bg-gradient-to-r from-purple-900 to-purple-700 text-white py-20">
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-5xl font-bold mb-6">Our Story</h1>
          <p className="text-xl max-w-3xl mx-auto">
            From a small boutique to a leading online fashion destination
          </p>
        </div>
      </section>
      
      {/* Our Mission */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <h2 className="text-3xl font-bold mb-6">Our Mission</h2>
            <p className="text-lg text-gray-700 mb-8">
              At Siraj Online Store, we're committed to bringing you the latest trends in fashion while 
              maintaining the highest standards of quality and sustainability. We believe that everyone 
              deserves to look and feel their best without compromising on ethics or the environment.
            </p>
            <p className="text-lg text-gray-700">
              Founded in 2023, we've grown from a small local boutique to a trusted online destination 
              for fashion enthusiasts worldwide. Our carefully curated collections reflect our passion 
              for style, comfort, and conscious consumerism.
            </p>
          </div>
        </div>
      </section>
      
      {/* Values */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Our Values</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Quality Craftsmanship</h3>
              <p className="text-gray-600">
                We source only the finest materials and work with skilled artisans to create products 
                that stand the test of time.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Sustainable Practices</h3>
              <p className="text-gray-600">
                From eco-friendly packaging to ethical manufacturing, we're committed to reducing 
                our environmental footprint.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow text-center">
              <div className="bg-purple-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-purple-700" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <h3 className="text-xl font-bold mb-2">Customer First</h3>
              <p className="text-gray-600">
                Your satisfaction is our top priority. Our dedicated team is always ready to help with 
                any questions or concerns.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Team */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-bold mb-12 text-center">Meet Our Team</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map(member => (
              <TeamMember key={member.id} member={member} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
};

export default About;