<?php
/*
	PHP contact form script
	Version: 1.0
	Hermes Garcia
	info@hermesgarcia.com
*/
/***************** Configuration *****************/
$contactEmailTo = 'info@herydigital.com';
$contactEmailFrom = 'contacto@herydigital.com';
$ccEmail = 'hermesgarcia@herydigital.com';
$bccEmail = 'hgarciamanzanarez@gmail.com';
$subjectTitle = 'Mensaje desde herydigital.com';
$nameTitle = 'Nombre:';
$phoneTitle = 'Teléfono:';
$emailTitle = 'Email:';
$messageTitle = 'Mensaje:';

$contactErrorName = 'El nombre es muy corto o muy largo';
$contactErrorPhone = 'El teléfono es muy corto o muy largo';
$contactErrorEmail = 'Por favor ingresa un email válido';
$contactErrorSubject = 'El asunto es muy corto o muy largo';
$contactErrorMessage = 'Tu mensaje es muy corto, escribe un poco más para nosotros';

/********** Send Script ***********/
$tz = 'America/Mexico_City';
$timestamp = time();
$dt = new DateTime("now", new DateTimeZone($tz));
$dt->setTimestamp($timestamp);
$date = $dt->format('Y-m-d H:i:s');

if (!isset($_SERVER['HTTP_X_REQUESTED_WITH']) and strtolower($_SERVER['HTTP_X_REQUESTED_WITH']) != 'xmlhttprequest') {
	die('Lo sentimos, la petición debe ser tipo Ajax POST');
}

if (isset($_POST)) {

	$name = filter_var($_POST["name"], FILTER_SANITIZE_STRING);
	$phone = filter_var($_POST["telephone"], FILTER_SANITIZE_STRING);
	$email = filter_var($_POST["email"], FILTER_SANITIZE_EMAIL);
	$subject = filter_var($_POST["subject"], FILTER_SANITIZE_STRING, FILTER_FLAG_NO_ENCODE_QUOTES);
	$message = filter_var($_POST["message"], FILTER_SANITIZE_STRING);

	if (!$contactEmailTo || $contactEmailTo == 'contact@example.com') {
		die('El email de recepción para el formulario de contacto no ha sudo configurado');
	}

	if (strlen($name) < 4 || strlen($name) > 50) {
		die($contactErrorName);
	}

	if (!$email) {
		die($contactErrorEmail);
	}

	if (strlen($phone) < 8 || strlen($phone) > 12) {
		die($contactErrorPhone);
	}

	if (strlen($subject) < 3 || strlen($subject) > 256) {
		die($contactErrorSubject);
	}

	if (strlen($message) < 3 || strlen($message) > 512) {
		die($contactErrorMessage);
	}

	if (!isset($contactEmailFrom)) {
		$contactEmailFrom = 'contacto@' . @preg_replace('/^www\./', '', $_SERVER['SERVER_NAME']);
	}

	$headers = 'From: ' . $name . ' <' . $contactEmailFrom . '>' . PHP_EOL;
	$headers .= 'Reply-To: ' . $email . PHP_EOL;
	$headers .= 'Cc: ' . $ccEmail . PHP_EOL;
	$headers .= 'Bcc: ' . $bccEmail . PHP_EOL;
	$headers .= 'MIME-Version: 1.0' . PHP_EOL;
	$headers .= 'Content-Type: text/html; charset=UTF-8' . PHP_EOL;
	$headers .= 'X-Mailer: PHP/' . phpversion();

	$message_content = '<strong>' . $nameTitle . '</strong> ' . $name . '<br>';
	$message_content .= '<strong>' . $phoneTitle . '</strong> ' . $phone . '<br>';
	$message_content .= '<strong>' . $emailTitle . '</strong> ' . $email . '<br>';
	$message_content .= '<strong>' . $messageTitle . '</strong> ' . nl2br($message);

	$sendemail = mail($contactEmailTo, $subjectTitle . ' ' . $subject, $message_content, $headers);

	if ($sendemail) {
		echo "OK";
	} else {
		echo 'El email no pudo ser enviado, intentálo de nuevo.';
	}
}
