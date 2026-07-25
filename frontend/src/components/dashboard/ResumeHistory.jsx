import { useEffect, useState } from "react";
import { getResumeHistory } from "../../services/history";

function ResumeHistory() {

    const [history, setHistory] = useState([]);

    useEffect(() => {

        const loadHistory = async () => {

            try {

                const data = await getResumeHistory();

                setHistory(data);

            } catch (err) {

                console.error(err);

            }

        };

        loadHistory();

    }, []);

    return (

        <div className="bg-white rounded-2xl shadow-lg p-6 mt-8">

            <h2 className="text-2xl font-semibold mb-5">
                Resume History
            </h2>

            {history.length === 0 ? (

                <p>No resumes uploaded yet.</p>

            ) : (

                <div className="space-y-4">

                    {history.map((resume, index) => (

                        <div
                            key={index}
                            className="border rounded-xl p-4 flex justify-between"
                        >

                            <div>

                                <h3 className="font-semibold">
                                    {resume.filename}
                                </h3>

                                <p>
                                    ATS Score: {resume.ats_score}%
                                </p>

                                <p>
                                    Semantic Match: {resume.semantic_score}%
                                </p>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}

export default ResumeHistory;