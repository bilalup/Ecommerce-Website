const TeamMember = ({ member }) => {
  return (
    <div className="bg-white rounded-lg shadow-lg overflow-hidden text-center">
      <div className="bg-gray-200 border-2 border-dashed rounded-xl w-full h-64" />
      <div className="p-6">
        <h3 className="text-xl font-bold">{member.name}</h3>
        <p className="text-purple-700 mb-3">{member.role}</p>
        <p className="text-gray-600 mb-4">{member.bio}</p>
        <div className="flex justify-center space-x-4">
          {member && (
            <a href={member} className="text-gray-600 hover:text-purple-700">
              
            </a>
          
          )}
        </div>
      </div>
    </div>
  );
};

export default TeamMember;