export default function About() {
  return (
    <section id="about" className="about">
      <h2 className="section-title">About Us</h2>
      <p className="section-subtitle">Your Story, Our Passion</p>
      <div className="about-content">
        <p>
          At LV Clicks - Lens Video Productions, we believe that every moment deserves to be preserved
          beautifully. With years of experience in photography and videography, we bring creativity,
          professionalism, and passion to every project.
        </p>
        <p>
          Our team of skilled photographers and videographers is dedicated to capturing authentic emotions
          and creating timeless memories. Whether it&apos;s a wedding, corporate event, or personal portrait
          session, we approach each project with the same level of commitment and artistry.
        </p>

        <div className="stats">
          <div className="stat-item">
            <span className="stat-number">500+</span>
            <span className="stat-label">Happy Clients</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">1000+</span>
            <span className="stat-label">Events Covered</span>
          </div>
          <div className="stat-item">
            <span className="stat-number">5+</span>
            <span className="stat-label">Years Experience</span>
          </div>
        </div>
      </div>
    </section>
  );
}
