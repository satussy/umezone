<!DOCTYPE HTML>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title></title>
  <link rel="stylesheet" href="css/index.css" />
</head>
<body>
<h1>Command</h1>
<ul class="commandContainer">
  <li><a href="index.php?cmd=clear">Clear</a></li>
  <li><a href="index.php?cmd=pause">Pause</a></li>
  <li><a href=""></a></li>
  <li><a href=""></a></li>
  <li><a href=""></a></li>
  <li><a href=""></a></li>
</ul>
<h1>Status</h1>
<p>{{isRunning?"Running":"Wait"}}</p>
{% if isPaused %}
  <p>Paused</p>
{% endif %}

{% if isCleared %}
  <p>Cleared</p>
{% else %}
  <p>Last Run:{{data.startAt|date("Y-m-d H:i:s")}} ( {{(now-data.startAt)//60}} min {{(now-data.startAt)%60}} sec ago )</p>
{% endif %}

<h1>Image</h1>
<div class="logImageContainer">
  {% for line in log.image%}
  <a class="logImage" href="error/{{line}}">
    <div class="overlay"></div>
    <img src="error/{{line}}" >
    <h2>{{line}}</h2>
  </a>
  {% endfor %}
</div>

<h1>Log <span class="time">({{log.log.modified|date("Y-m-d H:i:s")}})</span></h1>
{% for line in log.log.list %}
  {{line}}<br>
{% endfor %}

<h1>Error <span class="time">({{log.error.modified|date("Y-m-d H:i:s")}})</span></h1>
{% for line in log.error.list%}
{{line}}<br>
{% endfor %}
  
</body>
</html>
