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
    body = f"A new event '{event.name}' has been created at {event.location}."  # Use dot notation to access the event name

    # Create a MIME multipart message
    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))  # Attach the email body to the message

    # Set up the SMTP server and send the email
    server = smtplib.SMTP('smtp.gmail.com', 587)  # Connect to the Gmail SMTP server
    server.starttls()  # Start TLS encryption
    server.login(from_email, from_password)  # Log in to the email account using the App Password
    text = msg.as_string()  # Convert the message to a string
    server.sendmail(from_email, to_email, text)  # Send the email
    server.quit()  # Quit the SMTP server