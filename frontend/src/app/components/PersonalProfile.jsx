import { useRef } from "react";
import { Lock, Camera } from "lucide-react";

export default function PersonalProfile({ user, onUpdate }) {
  const fileInputRef = useRef(null);

  const handleChange = (e) => {
    onUpdate(e.target.name, e.target.value);
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      onUpdate("avatar", imageUrl);
    }
  };

  return (
    <div className="profile-section">
      <h1 className="page-title">Personal Profile</h1>
      <p className="page-subtitle">Manage your personal work details</p>

      <div className="profile-card">
        {/* Left Column - Avatar */}
        <div className="left-column">
          <h3 className="section-title">Basic Info</h3>
          <div className="avatar-wrapper">
            <img src={user.avatar || "/default-avatar.png"} alt="Profile" className="avatar-lg" />
            <button
              className="camera-btn"
              onClick={() => fileInputRef.current.click()}
            >
              <Camera size={18} />
            </button>
            <input
              type="file"
              ref={fileInputRef}
              onChange={handleImageUpload}
              hidden
              accept="image/*"
            />
          </div>
          <p className="upload-text">JPG / PNG • Max 5MB</p>
        </div>

        {/* Right Column - Form */}
        <div className="right-column">
          <div className="form-group">
            <div className="form-row">
              <div className="form-col">
                <label>Full name</label>
                <input
                  name="fullName"
                  value={user.fullName}
                  onChange={handleChange}
                />
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label>Work email</label>
                <div className="input-with-icon">
                  <input value={user.email} disabled />
                  <Lock size={16} className="input-icon-right" />
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label>Role / Job title</label>
                <div className="input-with-icon">
                  <input
                    name="jobTitle"
                    value={user.jobTitle}
                    onChange={handleChange}
                    className="input-imitation"
                  />
                  <Lock size={16} className="input-icon-right" />
                </div>
              </div>
              <div className="form-col">
                <label>Workflow role</label>
                {/* Removed custom ChevronDown to allow native select arrow */}
                <select
                  name="workflowRole"
                  value={user.workflowRole}
                  onChange={handleChange}
                >
                  <option>Reviewer</option>
                  <option>Admin</option>
                </select>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label>Department / Team</label>
                {/* Removed custom ChevronDown */}
                <select
                  name="department"
                  value={user.department}
                  onChange={handleChange}
                >
                  <option>Marketing</option>
                  <option>Design</option>
                  <option>Content</option>
                  <option>Management</option>
                </select>
              </div>
              <div className="form-col">
                <label>Preferred working language</label>
                <div className="language-group" style={{ backgroundColor: 'var(--input-bg)' }}>
                  {["Sinhala", "Tamil", "English"].map((lang) => (
                    <button
                      key={lang}
                      className={`lang-btn ${user.language === lang ? "active" : ""}`}
                      onClick={() => onUpdate("language", lang)}
                    >
                      {lang}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <div className="form-row">
              <div className="form-col">
                <label>Time zone</label>
                {/* Removed custom ChevronDown */}
                <select
                  name="timeZone"
                  value={user.timeZone}
                  onChange={handleChange}
                >
                  <option>(GMT+5:30) Sri Lanka</option>
                  <option>(GMT+0) UTC</option>
                  <option>(GMT+1) Europe</option>
                </select>
              </div>
              <div className="form-col">
              </div>
            </div>
          </div>

          <div className="form-actions">
            <button className="btn btn-primary">Save Changes</button>
            <button className="btn btn-secondary">Cancel</button>
          </div>
        </div>
      </div>
    </div>
  );
}
