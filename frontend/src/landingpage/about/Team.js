import React from 'react';

const Team = () => {
  const teamMembers = [
    {
      name: "Ram Sah",
      role: "CEO & Founder",
      bio: "Tech visionary with 2+ years of experience leading e-commerce innovations and retail scaling strategies.",
      image: "media/ram.jpeg",
      socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Rohit",
      role: "Chief Technology Officer",
      bio: "Former lead systems architect. Passionate about building highly responsive, scalable cloud solutions and next-gen UI paradigms.",
      image: "media/rohit.jpg",
      socials: { twitter: "#", linkedin: "#", github: "#" }
    },
    {
      name: "Puja Rouniyar",
      role: "Head of Brand Experience",
      bio: "Award-winning designer dedicated to crafting premium, human-centric interfaces and consistent brand identities.",
      image: "media/car.jpg",
      socials: { twitter: "#", linkedin: "#", github: "#" }
    }
  ];

  return (
    <div className="py-5 bg-light rounded-4 my-5 px-3">
      <div className="container text-center">
        <span className="text-primary fw-bold text-uppercase" style={{ fontSize: "12px", letterSpacing: "2px" }}>The Minds Behind Zonda</span>
        <h2 className="fw-extrabold mt-2 mb-4" style={{ color: "#0f172a", fontSize: "32px", fontWeight: "800" }}>Meet Our Team</h2>
        <p className="text-muted mx-auto mb-5" style={{ maxWidth: "600px", fontSize: "15px" }}>
          We are a diverse group of builders, thinkers, and creators committed to delivering the ultimate e-commerce experience.
        </p>

        <div className="row g-4 justify-content-center">
          {teamMembers.map((member, index) => (
            <div key={index} className="col-12 col-md-6 col-lg-4">
              <div 
                className="card border-0 shadow-sm h-100 overflow-hidden"
                style={{
                  borderRadius: "16px",
                  transition: "all 0.3s cubic-bezier(0.25, 0.8, 0.25, 1)",
                  cursor: "pointer"
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.transform = "translateY(-8px)";
                  e.currentTarget.style.boxShadow = "0 20px 40px rgba(0, 0, 0, 0.08)";
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.transform = "translateY(0)";
                  e.currentTarget.style.boxShadow = "0 4px 6px rgba(0, 0, 0, 0.02)";
                }}
              >
                {/* Member Image */}
                <div style={{ height: "280px", overflow: "hidden", position: "relative" }}>
                  <img 
                    src={member.image} 
                    alt={member.name}
                    className="w-100 h-100"
                    style={{ objectFit: "cover", transition: "transform 0.5s ease" }}
                    onMouseEnter={(e) => e.currentTarget.style.transform = "scale(1.05)"}
                    onMouseLeave={(e) => e.currentTarget.style.transform = "scale(1)"}
                  />
                  <div 
                    className="position-absolute bottom-0 w-100 p-3" 
                    style={{ background: "linear-gradient(to top, rgba(0,0,0,0.7) 0%, rgba(0,0,0,0) 100%)" }}
                  >
                    <span className="badge bg-primary text-white" style={{ fontSize: "11px", fontWeight: "600" }}>{member.role}</span>
                  </div>
                </div>

                {/* Member Details */}
                <div className="card-body p-4 text-start">
                  <h5 className="fw-bold mb-2" style={{ color: "#1e293b" }}>{member.name}</h5>
                  <p className="text-muted mb-4" style={{ fontSize: "13px", lineHeight: "1.6" }}>{member.bio}</p>
                  
                  {/* Social Handles */}
                  <div className="d-flex gap-2">
                    <a href={member.socials.twitter} className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", padding: 0 }}>
                      <i className="bi bi-twitter"></i>
                    </a>
                    <a href={member.socials.linkedin} className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", padding: 0 }}>
                      <i className="bi bi-linkedin"></i>
                    </a>
                    <a href={member.socials.github} className="btn btn-outline-secondary btn-sm rounded-circle d-flex align-items-center justify-content-center" style={{ width: "32px", height: "32px", padding: 0 }}>
                      <i className="bi bi-github"></i>
                    </a>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Team;