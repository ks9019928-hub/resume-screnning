import { FileText, Award, Lightbulb, Mail, Phone, Globe, Briefcase } from 'lucide-react';


function ResumeOverview({ result }) {
  if (!result) return null;

  const filename = result.resume?.filename || result.filename || "Uploaded Resume";
  const hardSkills = result.analysis?.hard_skills || result.skills || [];
  const recommendations = result.recommendations || [];
  const experienceYears = result.analysis?.experience_years ?? result.experience_years;
  const contact = result.analysis?.contact || result.contact || {};

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-100 p-6 mt-6">
      <h2 className="text-xl font-semibold text-slate-800 mb-5 flex items-center gap-2">
        <FileText className="text-indigo-500" size={20} />
        Resume Overview
      </h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            File Name
          </span>
          <div className="flex items-center gap-2 font-medium text-slate-700 break-all text-sm">
            <FileText size={16} className="text-slate-400 flex-shrink-0" />
            {filename}
          </div>
        </div>

        <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Total Skills Found
          </span>
          <div className="flex items-center gap-2">
            <Award size={18} className="text-indigo-500" />
            <span className="font-bold text-2xl text-slate-800">
              {hardSkills.length}
            </span>
          </div>
        </div>

        <div className="flex flex-col bg-slate-50 p-4 rounded-xl border border-slate-100">
          <span className="text-xs font-semibold uppercase tracking-wider text-slate-400 mb-1">
            Actionable Tips
          </span>
          <div className="flex items-center gap-2">
            <Lightbulb size={18} className="text-amber-500" />
            <span className="font-bold text-2xl text-slate-800">
              {recommendations.length}
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Details if extracted */}
      {(contact.email || contact.phone || experienceYears !== undefined) && (
        <div className="pt-4 border-t border-slate-100 flex flex-wrap gap-4 text-xs text-slate-600">
          {experienceYears !== undefined && experienceYears > 0 && (
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg font-medium">
              <Briefcase size={14} className="text-slate-500" />
              <span>{experienceYears}+ Years Experience</span>
            </div>
          )}

          {contact.email && (
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Mail size={14} className="text-slate-500" />
              <span>{contact.email}</span>
            </div>
          )}

          {contact.phone && (
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Phone size={14} className="text-slate-500" />
              <span>{contact.phone}</span>
            </div>
          )}

          {contact.linkedin && (
            <div className="flex items-center gap-1.5 bg-slate-100 px-3 py-1.5 rounded-lg">
              <Globe size={14} className="text-slate-500" />
              <span>{contact.linkedin}</span>
            </div>
          )}
        </div>
      )}
    </div>
  );
}

export default ResumeOverview;