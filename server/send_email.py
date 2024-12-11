import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from model import Subscriber

# Function to send email notifications to all subscribers about a new event
def send_email_notification(event):
    db = SessionLocal()  # Create a new database session
    subscribers = db.query(Subscriber).all()  # Query all subscribers from the database

    for subscriber in subscribers:
        send_email(subscriber.email, event)  # Send an email to each subscriber

# Function to send an email to a specific email address about a new event
def send_email(to_email, event):
    from_email = "jay898522"
    from_password = "jaxp znag pirc hnco"  # Use the App Password generated from Google
    subject = "New Event Created!"  # Subject of the email
    body = f"""
    <html>
    <body>
        <h2>New Event Created!</h2>
        <p>A new event <strong>{event.name}</strong> has been created at <strong>{event.location}</strong>.</p>
        <p><strong>Event Details:</strong></p>
        <ul>
            <li><strong>Name:</strong> {event.name}</li>
            <li><strong>Location:</strong> {event.location}</li>
            <li><strong>Description:</strong> {event.description}</li>
            <li><strong>Created At:</strong> {event.created_at}</li>
            <li><strong>Expires At:</strong> {event.expiration}</li>
        </ul>
        <p>We hope to see you there!</p>
    </body>
    </html>
    """  # Use HTML to format the email body

    # Create a MIME multipart message
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'html'))  # Attach the email body to the message as HTML

    # Set up the SMTP server and send the email
    server = smtplib.SMTP('smtp.gmail.com', 587)  # Connect to the Gmail SMTP server
    server.starttls()  # Start TLS encryption
    server.login(from_email, from_password)  # Log in to the email account using the App Password
    text = msg.as_string()  # Convert the message to a string
    server.sendmail(from_email, to_email, text)  # Send the email
    server.quit()  # Quit the SMTP server