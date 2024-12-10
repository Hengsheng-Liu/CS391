# FILE: send_email.py

import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from sqlalchemy.orm import Session
from database import SessionLocal, engine
from model import Subscriber

def send_email_notification(event):
    db = SessionLocal()
    subscribers = db.query(Subscriber).all()
    for subscriber in subscribers:
        send_email(subscriber.email, event)

def send_email(to_email, event):
    from_email = "your_email@example.com"
    from_password = "your_password"
    subject = "New Event Created"
    body = f"A new event '{event.name}' has been created."

    msg = MIMEMultipart()
    msg['From'] = from_email
    msg['To'] = to_email
    msg['Subject'] = subject
    msg.attach(MIMEText(body, 'plain'))

    server = smtplib.SMTP('smtp.gmail.com', 587)
    server.starttls()
    server.login(from_email, from_password)
    text = msg.as_string()
    server.sendmail(from_email, to_email, text)
    server.quit()