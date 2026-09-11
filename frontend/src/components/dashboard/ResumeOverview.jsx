import { useState } from "react";
import { motion } from "framer-motion";
import {
  FileText,
  Award,
  Lightbulb,
  Mail,
  Phone,
  Globe,
  Briefcase,
  Copy,
  Check,
  User,
} from "lucide-react";

export default function ResumeOverview({ result }) {
  const [copiedKey, setCopiedKey] = useState(null);

  if (!result) return null;

  const filename =
    result.resume?.filename || result.filename || "Uploaded Resume";
  const hardSkills =
    result.analysis?.hard_skills || result.skills || [];
  const recommendations = result.recommendations || [];
  const experienceYears =
    result.analysis?.experience_years ?? result.experience_years;
  const contact = result.analysis?.contact || result.contact || {};

  const handleCopy = (text, key) => {
    if (!text) return;
    navigator.clipboard.writeText(text);
    setCopiedKey(key);
    setTimeout(() => setCopiedKey(null), 2000);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 15 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="glass-panel rounded-3xl p-6 sm:p-8 mt-6 border border-white/10 shadow-2xl relative overflow-hidden"
    >
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-indigo-500/30 to-purple-500/30 border border-indigo-400/30 flex items-center justify-center text-indigo-400 shadow-lg">
            <FileText size={20} />
          </div>
          <div>
            <h2 className="text-lg sm:text-xl font-extrabold text-white tracking-tight">
              Resume Profile & Overview
            </h2>
            <p className="text-xs text-slate-400">
              Parsed metadata and contact details from your document
            </p>
          </div>
        </div>

        {experienceYears !== undefined && experienceYears > 0 && (
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 text-xs font-bold self-start sm:self-auto">
            <Briefcase size={14} className="text-indigo-400" />
            <span>{experienceYears}+ Years Track Record</span>
          </div>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {/* File Name Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-indigo-500/30 transition-all flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Target Document
          </span>
          <div className="flex items-center gap-2.5 font-semibold text-slate-200 break-all text-sm">
            <FileText size={16} className="text-indigo-400 flex-shrink-0" />
            <span className="truncate">{filename}</span>
          </div>
        </div>

        {/* Skills Found Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-purple-500/30 transition-all flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Verified Competencies
          </span>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center">
              <Award size={18} />
            </div>
            <span className="font-black text-2xl text-white">
              {hardSkills.length}{" "}
              <span className="text-xs font-normal text-slate-400">Skills</span>
            </span>
          </div>
        </div>

        {/* Actionable Recommendations Card */}
        <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800/80 hover:border-amber-500/30 transition-all flex flex-col justify-between">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mb-2">
            Optimization Actions
          </span>
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center">
              <Lightbulb size={18} />
            </div>
            <span className="font-black text-2xl text-white">
              {recommendations.length}{" "}
              <span className="text-xs font-normal text-slate-400">Fixes</span>
            </span>
          </div>
        </div>
      </div>

      {/* Candidate Contact Badges */}
      {(contact.name || contact.email || contact.phone || contact.linkedin) && (
        <div className="pt-4 border-t border-slate-800/80 flex flex-wrap items-center gap-3 text-xs">
          <span className="text-[11px] font-bold uppercase tracking-wider text-slate-400 mr-1">
            Contact Details:
          </span>

          {contact.name && (
            <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 text-slate-300 font-medium">
              <User size={13} className="text-indigo-400" />
              <span>{contact.name}</span>
            </div>
          )}

          {contact.email && (
            <button
              type="button"
              onClick={() => handleCopy(contact.email, "email")}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-indigo-500/40 text-slate-300 font-medium transition-all"
            >
              <Mail size={13} className="text-indigo-400" />
              <span>{contact.email}</span>
              {copiedKey === "email" ? (
                <Check size={12} className="text-emerald-400 ml-1" />
              ) : (
                <Copy
                  size={12}
                  className="text-slate-500 group-hover:text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </button>
          )}

          {contact.phone && (
            <button
              type="button"
              onClick={() => handleCopy(contact.phone, "phone")}
              className="group inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-indigo-500/40 text-slate-300 font-medium transition-all"
            >
              <Phone size={13} className="text-emerald-400" />
              <span>{contact.phone}</span>
              {copiedKey === "phone" ? (
                <Check size={12} className="text-emerald-400 ml-1" />
              ) : (
                <Copy
                  size={12}
                  className="text-slate-500 group-hover:text-slate-300 ml-1 opacity-0 group-hover:opacity-100 transition-opacity"
                />
              )}
            </button>
          )}

          {contact.linkedin && (
            <a
              href={
                contact.linkedin.startsWith("http")
                  ? contact.linkedin
                  : `https://${contact.linkedin}`
              }
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-900/80 border border-slate-700/80 hover:border-indigo-500/40 text-indigo-400 font-medium hover:text-indigo-300 transition-all"
            >
              <Globe size={13} />
              <span>LinkedIn Profile</span>
            </a>
          )}
        </div>
      )}
    </motion.div>
  );
}