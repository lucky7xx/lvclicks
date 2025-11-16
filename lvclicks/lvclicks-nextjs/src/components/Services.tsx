export default function Services() {
  const services = [
    {
      title: 'Wedding Photography',
      description: 'Capture the magic of your special day with our artistic wedding photography. From candid moments to traditional portraits, we preserve every emotion.'
    },
    {
      title: 'Cinematic Videos',
      description: 'Create stunning cinematic videos that tell your story. Professional editing, color grading, and storytelling that brings your vision to life.'
    },
    {
      title: 'Pre-Wedding Shoots',
      description: 'Beautiful pre-wedding photography sessions in stunning locations. Let your love story unfold through our creative lens.'
    },
    {
      title: 'Event Coverage',
      description: 'From birthdays to corporate events, we document every significant moment with professional photography and videography services.'
    },
    {
      title: 'Portrait Photography',
      description: 'Professional portraits for individuals, families, and corporate needs. High-quality images that capture personality and elegance.'
    },
    {
      title: 'Product Photography',
      description: 'Showcase your products with stunning commercial photography. Perfect for e-commerce, catalogs, and marketing materials.'
    },
    {
      title: 'Maternity Photography',
      description: 'Celebrate the beauty of pregnancy with elegant maternity photoshoots. Gentle, artistic portraits that capture this precious journey to motherhood.'
    },
    {
      title: 'Baby & Newborn Photography',
      description: 'Precious newborn and baby photography sessions in a safe, comfortable environment. Capturing the tiny details and early memories that last forever.'
    }
  ];

  return (
    <section id="services" className="services">
      <h2 className="section-title">Our Services</h2>
      <p className="section-subtitle">Premium Photography & Videography Solutions</p>
      <div className="services-grid">
        {services.map((service, index) => (
          <div key={index} className="service-card">
            <h3>{service.title}</h3>
            <p>{service.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
}
