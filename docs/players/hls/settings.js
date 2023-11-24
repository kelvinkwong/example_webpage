function getQueryParam(target) {
    if (location.search)
        for (query of location.search.slice(1).split('&'))
        {
            aquery = query.split('=');
            if (aquery[0] == target)
                return aquery[1];
        }
    return null;
}

function getBooleanParam(param, defaultValue) {
var value = getQueryParam(param);
if (
  value !== undefined &&
  (value == "true" || value == "yes" || value == "on")
) {
  return true;
} else if (
  value !== undefined &&
  (value == "false" || value == "no" || value == "off")
) {
  return false;
}
return defaultValue;
}
