import React, { useState } from 'react';
import { FaPlus, FaTrash, FaCertificate, FaChevronDown, FaChevronUp, FaEdit, FaSave } from 'react-icons/fa';

export default function CertificationsSection({ isEditing }) {
  const [sectionTitle, setSectionTitle] = useState('Certifications & Achievements');
  const [isEditingTitle, setIsEditingTitle] = useState(false);
  const [certifications, setCertifications] = useState([]);
  const [expandedCerts, setExpandedCerts] = useState({});

  const handleAddCertification = () => {
    const newCert = {
      id: Date.now(),
      title: '',
      issuer: '',
      date: '',
      url: '',
      description: '',
      bullets: []
    };
    setCertifications([...certifications, newCert]);
    setExpandedCerts({ ...expandedCerts, [newCert.id]: true });
  };

  const handleAddBullet = (certId) => {
    setCertifications(certs =>
      certs.map(cert =>
        cert.id === certId
          ? { ...cert, bullets: [...cert.bullets, { id: Date.now(), text: '' }] }
          : cert
      )
    );
  };

  const handleUpdateBullet = (certId, bulletId, value) => {
    setCertifications(certs =>
      certs.map(cert =>
        cert.id === certId
          ? {
              ...cert,
              bullets: cert.bullets.map(bullet =>
                bullet.id === bulletId ? { ...bullet, text: value } : bullet
              )
            }
          : cert
      )
    );
  };

  const handleRemoveBullet = (certId, bulletId) => {
    setCertifications(certs =>
      certs.map(cert =>
        cert.id === certId
          ? { ...cert, bullets: cert.bullets.filter(bullet => bullet.id !== bulletId) }
          : cert
      )
    );
  };

  const toggleExpand = (id) => {
    setExpandedCerts(prev => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        {isEditingTitle ? (
          <div className="flex items-center gap-2">
            <input
              type="text"
              value={sectionTitle}
              onChange={(e) => setSectionTitle(e.target.value)}
              className="text-xl font-semibold text-gray-900 border-b border-gray-300 focus:border-blue-500 focus:outline-none"
            />
            <button
              onClick={() => setIsEditingTitle(false)}
              className="text-blue-600 hover:text-blue-800"
            >
              <FaSave />
            </button>
          </div>
        ) : (
          <div className="flex items-center gap-2">
            <h3 className="text-xl font-semibold text-gray-900">{sectionTitle}</h3>
            {isEditing && (
              <button
                onClick={() => setIsEditingTitle(true)}
                className="text-blue-600 hover:text-blue-800"
              >
                <FaEdit />
              </button>
            )}
          </div>
        )}
      </div>
      
      <div className="space-y-4">
        {certifications.map((cert) => (
          <div key={cert.id} className="bg-white rounded-lg border p-4">
            <div className="flex justify-between items-start">
              <div className="flex-1">
                {isEditing ? (
                  <div className="space-y-3">
                    <div className="flex justify-between">
                      <input
                        type="text"
                        value={cert.title}
                        onChange={(e) => setCertifications(certs =>
                          certs.map(c =>
                            c.id === cert.id ? { ...c, title: e.target.value } : c
                          )
                        )}
                        placeholder="Certification Title"
                        className="font-medium text-lg w-full"
                      />
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(cert.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {expandedCerts[cert.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        <button
                          onClick={() => setCertifications(certs => certs.filter(c => c.id !== cert.id))}
                          className="text-red-600 hover:text-red-800"
                        >
                          <FaTrash />
                        </button>
                      </div>
                    </div>
                    
                    {expandedCerts[cert.id] && (
                      <div className="space-y-3">
                        <input
                          type="text"
                          value={cert.issuer}
                          onChange={(e) => setCertifications(certs =>
                            certs.map(c =>
                              c.id === cert.id ? { ...c, issuer: e.target.value } : c
                            )
                          )}
                          placeholder="Issuing Organization"
                          className="text-sm text-gray-600 w-full"
                        />
                        <div className="flex gap-4">
                          <input
                            type="date"
                            value={cert.date}
                            onChange={(e) => setCertifications(certs =>
                              certs.map(c =>
                                c.id === cert.id ? { ...c, date: e.target.value } : c
                              )
                            )}
                            className="text-sm text-gray-600"
                          />
                          <input
                            type="url"
                            value={cert.url}
                            onChange={(e) => setCertifications(certs =>
                              certs.map(c =>
                                c.id === cert.id ? { ...c, url: e.target.value } : c
                              )
                            )}
                            placeholder="Certification URL"
                            className="text-sm text-blue-600 flex-1"
                          />
                        </div>
                        
                        <div className="space-y-2">
                          {cert.bullets.map((bullet) => (
                            <div key={bullet.id} className="flex items-center gap-2">
                              <span>•</span>
                              <input
                                type="text"
                                value={bullet.text}
                                onChange={(e) => handleUpdateBullet(cert.id, bullet.id, e.target.value)}
                                placeholder="Bullet point"
                                className="flex-1 text-sm text-gray-600"
                              />
                              <button
                                onClick={() => handleRemoveBullet(cert.id, bullet.id)}
                                className="text-red-600 hover:text-red-800"
                              >
                                <FaTrash />
                              </button>
                            </div>
                          ))}
                          <button
                            onClick={() => handleAddBullet(cert.id)}
                            className="text-sm text-blue-600 hover:text-blue-800"
                          >
                            <FaPlus /> Add Bullet Point
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-medium text-lg">{cert.title}</h4>
                        <p className="text-sm text-gray-600">{cert.issuer}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => toggleExpand(cert.id)}
                          className="text-gray-600 hover:text-gray-800"
                        >
                          {expandedCerts[cert.id] ? <FaChevronUp /> : <FaChevronDown />}
                        </button>
                        {cert.url && (
                          <a
                            href={cert.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-blue-600 hover:text-blue-800"
                          >
                            <FaCertificate />
                          </a>
                        )}
                      </div>
                    </div>
                    
                    {expandedCerts[cert.id] && (
                      <>
                        <p className="text-sm text-gray-500">
                          {cert.date && new Date(cert.date).toLocaleDateString()}
                        </p>
                        {cert.bullets.length > 0 && (
                          <ul className="list-disc list-inside space-y-1">
                            {cert.bullets.map((bullet) => (
                              <li key={bullet.id} className="text-sm text-gray-600">
                                {bullet.text}
                              </li>
                            ))}
                          </ul>
                        )}
                      </>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
        
        {isEditing && (
          <button
            onClick={handleAddCertification}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-800"
          >
            <FaPlus />
            <span>Add Certification</span>
          </button>
        )}
      </div>
    </section>
  );
} 