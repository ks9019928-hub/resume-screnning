function SkillsCard({ skills }) {
  return (
    <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

      <h2 className="text-2xl font-semibold mb-5">
        Extracted Skills
      </h2>

      <div className="flex flex-wrap gap-3">

        {skills.map((skill, index) => (
          <span
            key={index}
            className="bg-blue-100 text-blue-700 px-4 py-2 rounded-full text-sm font-medium"
          >
            {skill}
          </span>
        ))}

      </div>

    </div>
  );
}

export default SkillsCard;