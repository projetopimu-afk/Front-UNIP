
import React, { useState, useEffect, useCallback } from 'react';
import { User, Class, Activity, Submission } from './types';
import { api } from './services';
import { Button, Card, Spinner } from './components';
import { UploadIcon } from './constants';

const StudentDashboard: React.FC<{ user: User }> = ({ user }) => {
    const [classes, setClasses] = useState<Class[]>([]);
    const [selectedClass, setSelectedClass] = useState<Class | null>(null);
    const [activities, setActivities] = useState<Activity[]>([]);
    const [submissions, setSubmissions] = useState<Map<string, Submission>>(new Map());
    const [loading, setLoading] = useState(true);

    const fetchClasses = useCallback(async () => {
        setLoading(true);
        const fetchedClasses = await api.getClassesByStudent(user.id);
        setClasses(fetchedClasses);
        if (fetchedClasses.length > 0) {
            setSelectedClass(fetchedClasses[0]);
        }
        setLoading(false);
    }, [user.id]);
    
    useEffect(() => {
        fetchClasses();
    }, [fetchClasses]);

    useEffect(() => {
        const fetchActivitiesAndSubmissions = async () => {
            if (selectedClass) {
                const fetchedActivities = await api.getActivitiesByClass(selectedClass.id);
                setActivities(fetchedActivities);
                
                const newSubmissions = new Map<string, Submission>();
                for (const activity of fetchedActivities) {
                    const submission = await api.getSubmissionForActivity(activity.id, user.id);
                    if (submission) {
                        newSubmissions.set(activity.id, submission);
                    }
                }
                setSubmissions(newSubmissions);
            }
        };
        fetchActivitiesAndSubmissions();
    }, [selectedClass, user.id]);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>, activityId: string) => {
        if(e.target.files && e.target.files[0]) {
            // In a real app, you would upload the file and get a URL
            const fakeFileUrl = `path/to/${e.target.files[0].name}`;
            handleSubmission(activityId, fakeFileUrl);
        }
    };
    
    const handleSubmission = async (activityId: string, fileUrl: string) => {
        const newSubmission = await api.submitActivity({
            activityId,
            studentId: user.id,
            fileUrl,
            submittedAt: new Date().toISOString()
        });
        setSubmissions(prev => new Map(prev).set(activityId, newSubmission));
    };

    if (loading) return <div className="flex justify-center items-center h-screen"><Spinner /></div>;

    return (
        <div className="container mx-auto p-4 md:p-8">
            <h1 className="text-3xl font-bold mb-6">Painel do Aluno</h1>
            {classes.length === 0 ? (
                <Card><p>Você não está matriculado em nenhuma turma.</p></Card>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                    <div className="md:col-span-1">
                        <Card>
                            <h2 className="text-xl font-bold mb-4">Minhas Turmas</h2>
                            <ul className="space-y-2">
                                {classes.map(cls => (
                                    <li key={cls.id}>
                                        <button 
                                            onClick={() => setSelectedClass(cls)}
                                            className={`w-full text-left p-3 rounded-md transition-colors duration-200 ${selectedClass?.id === cls.id ? 'bg-primary text-white' : 'bg-gray-100 hover:bg-gray-200'}`}
                                        >
                                            {cls.name}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        </Card>
                    </div>
                    <div className="md:col-span-3">
                         {selectedClass ? (
                            <Card>
                                <h2 className="text-2xl font-bold mb-4">Atividades de {selectedClass.name}</h2>
                                {activities.length > 0 ? (
                                    <div className="space-y-4">
                                        {activities.map(activity => {
                                            const submission = submissions.get(activity.id);
                                            const isSubmitted = !!submission;
                                            const isPastDue = new Date(activity.dueDate) < new Date();

                                            return (
                                            <div key={activity.id} className="p-4 border rounded-lg bg-gray-50">
                                                <div className="flex flex-col md:flex-row justify-between md:items-center">
                                                    <div>
                                                        <h3 className="font-bold text-lg">{activity.title}</h3>
                                                        <p className="text-gray-600">{activity.description}</p>
                                                        <p className="text-sm text-gray-500 mt-1">
                                                            Data de entrega: {new Date(activity.dueDate).toLocaleDateString()}
                                                        </p>
                                                    </div>
                                                    <div className="mt-4 md:mt-0 flex flex-col items-start md:items-end">
                                                        {isSubmitted ? (
                                                            <div className="text-green-600 font-semibold text-center">
                                                                <p>Enviado em {new Date(submission.submittedAt).toLocaleDateString()}</p>
                                                                <p className="text-sm">(Arquivo: {submission.fileUrl.split('/').pop()})</p>
                                                            </div>
                                                        ) : isPastDue ? (
                                                            <p className="text-red-500 font-semibold">Prazo encerrado</p>
                                                        ) : (
                                                            <>
                                                                <input type="file" id={`file-upload-${activity.id}`} className="hidden" onChange={(e) => handleFileChange(e, activity.id)} />
                                                                <label htmlFor={`file-upload-${activity.id}`} className="cursor-pointer bg-secondary hover:bg-secondary-hover text-white font-bold py-2 px-4 rounded inline-flex items-center">
                                                                    <UploadIcon className="w-5 h-5 mr-2" />
                                                                    <span>Enviar Atividade</span>
                                                                </label>
                                                            </>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            )
                                        })}
                                    </div>
                                ) : <p>Nenhuma atividade para esta turma.</p>}
                            </Card>
                         ) : null}
                    </div>
                </div>
            )}
        </div>
    );
};

export default StudentDashboard;
