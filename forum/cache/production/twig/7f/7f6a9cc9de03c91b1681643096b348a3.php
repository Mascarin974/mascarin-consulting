<?php

use Twig\Environment;
use Twig\Error\LoaderError;
use Twig\Error\RuntimeError;
use Twig\Extension\SandboxExtension;
use Twig\Markup;
use Twig\Sandbox\SecurityError;
use Twig\Sandbox\SecurityNotAllowedTagError;
use Twig\Sandbox\SecurityNotAllowedFilterError;
use Twig\Sandbox\SecurityNotAllowedFunctionError;
use Twig\Source;
use Twig\Template;

/* acp_main.html */
class __TwigTemplate_55bd4ccf89daa277de038ad42955f018 extends \Twig\Template
{
    private $source;
    private $macros = [];

    public function __construct(Environment $env)
    {
        parent::__construct($env);

        $this->source = $this->getSourceContext();

        $this->parent = false;

        $this->blocks = [
        ];
    }

    protected function doDisplay(array $context, array $blocks = [])
    {
        $macros = $this->macros;
        // line 1
        $location = "overall_header.html";
        $namespace = false;
        if (strpos($location, '@') === 0) {
            $namespace = substr($location, 1, strpos($location, '/') - 1);
            $previous_look_up_order = $this->env->getNamespaceLookUpOrder();
            $this->env->setNamespaceLookUpOrder(array($namespace, '__main__'));
        }
        $this->loadTemplate("overall_header.html", "acp_main.html", 1)->display($context);
        if ($namespace) {
            $this->env->setNamespaceLookUpOrder($previous_look_up_order);
        }
        // line 2
        echo "
<a id=\"maincontent\"></a>

";
        // line 5
        if (($context["S_RESTORE_PERMISSIONS"] ?? null)) {
            // line 6
            echo "
\t<h1>";
            // line 7
            echo $this->extensions['phpbb\template\twig\extension']->lang("PERMISSIONS_TRANSFERRED");
            echo "</h1>

\t<p>";
            // line 9
            echo $this->extensions['phpbb\template\twig\extension']->lang("PERMISSIONS_TRANSFERRED_EXPLAIN");
            echo "</p>

";
        } else {
            // line 12
            echo "
\t<h1>";
            // line 13
            echo $this->extensions['phpbb\template\twig\extension']->lang("WELCOME_PHPBB");
            echo "</h1>

\t<p>";
            // line 15
            echo $this->extensions['phpbb\template\twig\extension']->lang("ADMIN_INTRO");
            echo "</p>

\t";
            // line 17
            if (($context["S_UPDATE_INCOMPLETE"] ?? null)) {
                // line 18
                echo "\t\t<div class=\"errorbox\">
\t\t\t<p>";
                // line 19
                echo $this->extensions['phpbb\template\twig\extension']->lang("UPDATE_INCOMPLETE");
                echo " <a href=\"";
                echo ($context["U_VERSIONCHECK"] ?? null);
                echo "\">";
                echo $this->extensions['phpbb\template\twig\extension']->lang("MORE_INFORMATION");
                echo "</a></p>
\t\t</div>
\t";
            } elseif (            // line 21
($context["S_VERSIONCHECK_FAIL"] ?? null)) {
                // line 22
                echo "\t\t<div class=\"errorbox notice\">
\t\t\t<p>";
                // line 23
                echo $this->extensions['phpbb\template\twig\extension']->lang("VERSIONCHECK_FAIL");
                echo "</p>
\t\t\t<p>";
                // line 24
                echo ($context["VERSIONCHECK_FAIL_REASON"] ?? null);
                echo "</p>
\t\t\t<p><a href=\"";
                // line 25
                echo ($context["U_VERSIONCHECK_FORCE"] ?? null);
                echo "\">";
                echo $this->extensions['phpbb\template\twig\extension']->lang("VERSIONCHECK_FORCE_UPDATE");
                echo "</a> &middot; <a href=\"";
                echo ($context["U_VERSIONCHECK"] ?? null);
                echo "\">";
                echo $this->extensions['phpbb\template\twig\extension']->lang("MORE_INFORMATION");
                echo "</a></p>
\t\t</div>
\t";
            } elseif ( !            // line 27
($context["S_VERSION_UP_TO_DATE"] ?? null)) {
                // line 28
                echo "\t\t<div class=\"errorbox\">
\t\t\t<p>";
                // line 29
                echo $this->extensions['phpbb\template\twig\extension']->lang("VERSION_NOT_UP_TO_DATE_TITLE");
                echo "</p>
\t\t\t<p><a href=\"";
                // line 30
                echo ($context["U_VERSIONCHECK_FORCE"] ?? null);
                echo "\">";
                echo $this->extensions['phpbb\template\twig\extension']->lang("VERSIONCHECK_FORCE_UPDATE");
                echo "</a> &middot; <a href=\"";
                echo ($context["U_VERSIONCHECK"] ?? null);
                echo "\">";
                echo $this->extensions['phpbb\template\twig\extension']->lang("MORE_INFORMATION");
                echo "</a></p>
\t\t</div>
\t";
            } elseif ((            // line 32
($context["S_VERSION_UP_TO_DATE"] ?? null) && ($context["S_VERSIONCHECK_FORCE"] ?? null))) {
                // line 33
                echo "\t\t<div class=\"successbox\">
\t\t\t<p>";
                // line 34
                echo $this->extensions['phpbb\template\twig\extension']->lang("VERSION_UP_TO_DATE_ACP");
                echo "</p>
\t\t</div>
\t";
            }
            // line 37
            echo "\t";
            if (($context["S_VERSION_UPGRADEABLE"] ?? null)) {
                // line 38
                echo "\t\t<div class=\"errorbox notice\">
\t\t\t<p>";
                // line 39
                echo ($context["UPGRADE_INSTRUCTIONS"] ?? null);
                echo "</p>
\t\t</div>
\t";
            }
            // line 42
            echo "
\t";
            // line 43
            if (($context["S_SEARCH_INDEX_MISSING"] ?? null)) {
                // line 44
                echo "\t\t<div class=\"errorbox\">
\t\t\t<h3>";
                // line 45
                echo $this->extensions['phpbb\template\twig\extension']->lang("WARNING");
                echo "</h3>
\t\t\t<p>";
                // line 46
                echo $this->extensions['phpbb\template\twig\extension']->lang("NO_SEARCH_INDEX");
                echo "</p>
\t\t</div>
\t";
            }
            // line 49
            echo "
\t";
            // line 50
            if (($context["S_REMOVE_INSTALL"] ?? null)) {
                // line 51
                echo "\t\t<div class=\"errorbox\">
\t\t\t<h3>";
                // line 52
                echo $this->extensions['phpbb\template\twig\extension']->lang("WARNING");
                echo "</h3>
\t\t\t<p>";
                // line 53
                echo $this->extensions['phpbb\template\twig\extension']->lang("REMOVE_INSTALL");
                echo "</p>
\t\t</div>
\t";
            }
            // line 56
            echo "
\t";
            // line 57
            if (($context["S_MBSTRING_LOADED"] ?? null)) {
                // line 58
                echo "\t\t";
                if (($context["S_MBSTRING_FUNC_OVERLOAD_FAIL"] ?? null)) {
                    // line 59
                    echo "\t\t\t<div class=\"errorbox\">
\t\t\t\t<h3>";
                    // line 60
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_MBSTRING_FUNC_OVERLOAD");
                    echo "</h3>
\t\t\t\t<p>";
                    // line 61
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_MBSTRING_FUNC_OVERLOAD_EXPLAIN");
                    echo "</p>
\t\t\t</div>
\t\t";
                }
                // line 64
                echo "
\t\t";
                // line 65
                if (($context["S_MBSTRING_ENCODING_TRANSLATION_FAIL"] ?? null)) {
                    // line 66
                    echo "\t\t\t<div class=\"errorbox\">
\t\t\t\t<h3>";
                    // line 67
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_MBSTRING_ENCODING_TRANSLATION");
                    echo "</h3>
\t\t\t\t<p>";
                    // line 68
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_MBSTRING_ENCODING_TRANSLATION_EXPLAIN");
                    echo "</p>
\t\t\t</div>
\t\t";
                }
                // line 71
                echo "
\t\t";
                // line 72
                if (($context["S_MBSTRING_HTTP_INPUT_FAIL"] ?? null)) {
                    // line 73
                    echo "\t\t\t<div class=\"errorbox\">
\t\t\t\t<h3>";
                    // line 74
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_MBSTRING_HTTP_INPUT");
                    echo "</h3>
\t\t\t\t<p>";
                    // line 75
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_MBSTRING_HTTP_INPUT_EXPLAIN");
                    echo "</p>
\t\t\t</div>
\t\t";
                }
                // line 78
                echo "
\t\t";
                // line 79
                if (($context["S_MBSTRING_HTTP_OUTPUT_FAIL"] ?? null)) {
                    // line 80
                    echo "\t\t\t<div class=\"errorbox\">
\t\t\t\t<h3>";
                    // line 81
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_MBSTRING_HTTP_OUTPUT");
                    echo "</h3>
\t\t\t\t<p>";
                    // line 82
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_MBSTRING_HTTP_OUTPUT_EXPLAIN");
                    echo "</p>
\t\t\t</div>
\t\t";
                }
                // line 85
                echo "
\t\t";
                // line 86
                if (($context["S_DEFAULT_CHARSET_FAIL"] ?? null)) {
                    // line 87
                    echo "\t\t\t<div class=\"errorbox\">
\t\t\t\t<h3>";
                    // line 88
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_DEFAULT_CHARSET");
                    echo "</h3>
\t\t\t\t<p>";
                    // line 89
                    echo $this->extensions['phpbb\template\twig\extension']->lang("ERROR_DEFAULT_CHARSET_EXPLAIN");
                    echo "</p>
\t\t\t</div>
\t\t";
                }
                // line 92
                echo "\t";
            }
            // line 93
            echo "
\t";
            // line 94
            if (($context["S_WRITABLE_CONFIG"] ?? null)) {
                // line 95
                echo "\t\t<div class=\"errorbox notice\">
\t\t\t<p>";
                // line 96
                echo $this->extensions['phpbb\template\twig\extension']->lang("WRITABLE_CONFIG");
                echo "</p>
\t\t</div>
\t";
            }
            // line 99
            echo "
\t";
            // line 100
            if (($context["S_PHP_VERSION_OLD"] ?? null)) {
                // line 101
                echo "\t\t<div class=\"errorbox notice\">
\t\t\t<p>";
                // line 102
                echo $this->extensions['phpbb\template\twig\extension']->lang("PHP_VERSION_OLD");
                echo "</p>
\t\t</div>
\t";
            }
            // line 105
            echo "
\t";
            // line 106
            // line 107
            echo "
\t\t<div class=\"lside\">
\t\t\t<table class=\"table2 zebra-table no-header\" data-no-responsive-header=\"true\">
\t\t\t\t<thead>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<th>";
            // line 112
            echo $this->extensions['phpbb\template\twig\extension']->lang("STATISTIC");
            echo "</th>
\t\t\t\t\t\t<th>";
            // line 113
            echo $this->extensions['phpbb\template\twig\extension']->lang("VALUE");
            echo "</th>
\t\t\t\t\t</tr>
\t\t\t\t</thead>

\t\t\t\t<tbody>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 119
            echo ($this->extensions['phpbb\template\twig\extension']->lang("BOARD_STARTED") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 120
            echo ($context["START_DATE"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 123
            echo ($this->extensions['phpbb\template\twig\extension']->lang("AVATAR_DIR_SIZE") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 124
            echo ($context["AVATAR_DIR_SIZE"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 127
            echo ($this->extensions['phpbb\template\twig\extension']->lang("DATABASE_SIZE") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 128
            echo ($context["DBSIZE"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 131
            echo ($this->extensions['phpbb\template\twig\extension']->lang("UPLOAD_DIR_SIZE") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 132
            echo ($context["UPLOAD_DIR_SIZE"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 135
            echo ($this->extensions['phpbb\template\twig\extension']->lang("DATABASE_SERVER_INFO") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 136
            echo ($context["DATABASE_INFO"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 139
            echo ($this->extensions['phpbb\template\twig\extension']->lang("GZIP_COMPRESSION") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 140
            echo ($context["GZIP_COMPRESSION"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 143
            echo ($this->extensions['phpbb\template\twig\extension']->lang("PHP_VERSION") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 144
            echo ($context["PHP_VERSION_INFO"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 147
            echo ($this->extensions['phpbb\template\twig\extension']->lang("NUMBER_ORPHAN") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\">
\t\t\t\t\t\t";
            // line 149
            if ((($context["TOTAL_ORPHAN"] ?? null) > 0)) {
                // line 150
                echo "\t\t\t\t\t\t\t<a href=\"";
                echo ($context["U_ATTACH_ORPHAN"] ?? null);
                echo "\" title=\"";
                echo $this->extensions['phpbb\template\twig\extension']->lang("MORE_INFORMATION");
                echo "\"><strong>";
                echo ($context["TOTAL_ORPHAN"] ?? null);
                echo "</strong></a>
\t\t\t\t\t\t";
            } else {
                // line 152
                echo "\t\t\t\t\t\t\t<strong>";
                echo ($context["TOTAL_ORPHAN"] ?? null);
                echo "</strong>
\t\t\t\t\t\t";
            }
            // line 154
            echo "\t\t\t\t\t\t</td>
\t\t\t\t\t</tr>
\t\t\t\t\t";
            // line 156
            if (($context["S_VERSIONCHECK"] ?? null)) {
                // line 157
                echo "\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
                // line 158
                echo ($this->extensions['phpbb\template\twig\extension']->lang("BOARD_VERSION") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
                echo "</td>
\t\t\t\t\t\t<td class=\"tabled\">
\t\t\t\t\t\t\t<strong><a href=\"";
                // line 160
                echo ($context["U_VERSIONCHECK"] ?? null);
                echo "\" ";
                if (($context["S_VERSION_UP_TO_DATE"] ?? null)) {
                    echo "style=\"color: #228822;\" ";
                } elseif ( !($context["S_VERSIONCHECK_FAIL"] ?? null)) {
                    echo "style=\"color: #BC2A4D;\" ";
                }
                echo "title=\"";
                echo $this->extensions['phpbb\template\twig\extension']->lang("MORE_INFORMATION");
                echo "\">";
                echo ($context["BOARD_VERSION"] ?? null);
                echo "</a></strong> [&nbsp;<a href=\"";
                echo ($context["U_VERSIONCHECK_FORCE"] ?? null);
                echo "\">";
                echo $this->extensions['phpbb\template\twig\extension']->lang("VERSIONCHECK_FORCE_UPDATE");
                echo "</a>&nbsp;]
\t\t\t\t\t\t</td>
\t\t\t\t\t</tr>
\t\t\t\t\t";
            }
            // line 164
            echo "\t\t\t\t</tbody>
\t\t\t</table>

\t\t\t<table class=\"table2 zebra-table no-header\" data-no-responsive-header=\"true\">
\t\t\t\t<thead>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<th>";
            // line 170
            echo $this->extensions['phpbb\template\twig\extension']->lang("STATISTIC");
            echo "</th>
\t\t\t\t\t\t<th>";
            // line 171
            echo $this->extensions['phpbb\template\twig\extension']->lang("VALUE");
            echo "</th>
\t\t\t\t\t</tr>
\t\t\t\t</thead>

\t\t\t\t<tbody>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 177
            echo ($this->extensions['phpbb\template\twig\extension']->lang("NUMBER_POSTS") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 178
            echo ($context["TOTAL_POSTS"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 181
            echo ($this->extensions['phpbb\template\twig\extension']->lang("POSTS_PER_DAY") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 182
            echo ($context["POSTS_PER_DAY"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 185
            echo ($this->extensions['phpbb\template\twig\extension']->lang("NUMBER_TOPICS") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 186
            echo ($context["TOTAL_TOPICS"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 189
            echo ($this->extensions['phpbb\template\twig\extension']->lang("TOPICS_PER_DAY") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 190
            echo ($context["TOPICS_PER_DAY"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 193
            echo ($this->extensions['phpbb\template\twig\extension']->lang("NUMBER_USERS") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 194
            echo ($context["TOTAL_USERS"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 197
            echo ($this->extensions['phpbb\template\twig\extension']->lang("USERS_PER_DAY") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 198
            echo ($context["USERS_PER_DAY"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 201
            echo ($this->extensions['phpbb\template\twig\extension']->lang("NUMBER_FILES") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 202
            echo ($context["TOTAL_FILES"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">";
            // line 205
            echo ($this->extensions['phpbb\template\twig\extension']->lang("FILES_PER_DAY") . $this->extensions['phpbb\template\twig\extension']->lang("COLON"));
            echo "</td>
\t\t\t\t\t\t<td class=\"tabled\"><strong>";
            // line 206
            echo ($context["FILES_PER_DAY"] ?? null);
            echo "</strong></td>
\t\t\t\t\t</tr>
\t\t\t\t\t";
            // line 208
            if (($context["S_VERSIONCHECK"] ?? null)) {
                // line 209
                echo "\t\t\t\t\t<tr>
\t\t\t\t\t\t<td class=\"tabled\">&nbsp;</td>
\t\t\t\t\t\t<td class=\"tabled\">&nbsp;</td>
\t\t\t\t\t</tr>
\t\t\t\t\t";
            }
            // line 214
            echo "\t\t\t\t</tbody>
\t\t\t</table>
\t\t</div>

\t";
            // line 218
            if (($context["S_ACTION_OPTIONS"] ?? null)) {
                // line 219
                echo "\t\t<fieldset>
\t\t\t<legend>";
                // line 220
                echo $this->extensions['phpbb\template\twig\extension']->lang("STATISTIC_RESYNC_OPTIONS");
                echo "</legend>

\t\t\t<form id=\"action_online_form\" method=\"post\" action=\"";
                // line 222
                echo ($context["U_ACTION"] ?? null);
                echo "\" data-ajax=\"true\">
\t\t\t\t<dl>
\t\t\t\t\t<dt><label for=\"action_online\">";
                // line 224
                echo $this->extensions['phpbb\template\twig\extension']->lang("RESET_ONLINE");
                echo "</label><br /><span>&nbsp;</span></dt>
\t\t\t\t\t<dd><input type=\"hidden\" name=\"action\" value=\"online\" /><input class=\"button2\" type=\"submit\" id=\"action_online\" name=\"action_online\" value=\"";
                // line 225
                echo $this->extensions['phpbb\template\twig\extension']->lang("RUN");
                echo "\" /></dd>
\t\t\t\t</dl>
\t\t\t</form>

\t\t\t<form id=\"action_date_form\" method=\"post\" action=\"";
                // line 229
                echo ($context["U_ACTION"] ?? null);
                echo "\" data-ajax=\"true\">
\t\t\t\t<dl>
\t\t\t\t\t<dt><label for=\"action_date\">";
                // line 231
                echo $this->extensions['phpbb\template\twig\extension']->lang("RESET_DATE");
                echo "</label><br /><span>&nbsp;</span></dt>
\t\t\t\t\t<dd><input type=\"hidden\" name=\"action\" value=\"date\" /><input class=\"button2\" type=\"submit\" id=\"action_date\" name=\"action_date\" value=\"";
                // line 232
                echo $this->extensions['phpbb\template\twig\extension']->lang("RUN");
                echo "\" /></dd>
\t\t\t\t</dl>
\t\t\t</form>

\t\t\t<form id=\"action_stats_form\" method=\"post\" action=\"";
                // line 236
                echo ($context["U_ACTION"] ?? null);
                echo "\">
\t\t\t\t<dl>
\t\t\t\t\t<dt><label for=\"action_stats\">";
                // line 238
                echo $this->extensions['phpbb\template\twig\extension']->lang("RESYNC_STATS");
                echo "</label><br /><span>";
                echo $this->extensions['phpbb\template\twig\extension']->lang("RESYNC_STATS_EXPLAIN");
                echo "</span></dt>
\t\t\t\t\t<dd><input type=\"hidden\" name=\"action\" value=\"stats\" /><input class=\"button2\" type=\"submit\" id=\"action_stats\" name=\"action_stats\" value=\"";
                // line 239
                echo $this->extensions['phpbb\template\twig\extension']->lang("RUN");
                echo "\" /></dd>
\t\t\t\t</dl>
\t\t\t</form>

\t\t\t<form id=\"action_user_form\" method=\"post\" action=\"";
                // line 243
                echo ($context["U_ACTION"] ?? null);
                echo "\">
\t\t\t\t<dl>
\t\t\t\t\t<dt><label for=\"action_user\">";
                // line 245
                echo $this->extensions['phpbb\template\twig\extension']->lang("RESYNC_POSTCOUNTS");
                echo "</label><br /><span>";
                echo $this->extensions['phpbb\template\twig\extension']->lang("RESYNC_POSTCOUNTS_EXPLAIN");
                echo "</span></dt>
\t\t\t\t\t<dd><input type=\"hidden\" name=\"action\" value=\"user\" /><input class=\"button2\" type=\"submit\" id=\"action_user\" name=\"action_user\" value=\"";
                // line 246
                echo $this->extensions['phpbb\template\twig\extension']->lang("RUN");
                echo "\" /></dd>
\t\t\t\t</dl>
\t\t\t</form>

\t\t\t<form id=\"action_db_track_form\" method=\"post\" action=\"";
                // line 250
                echo ($context["U_ACTION"] ?? null);
                echo "\">
\t\t\t\t<dl>
\t\t\t\t\t<dt><label for=\"action_db_track\">";
                // line 252
                echo $this->extensions['phpbb\template\twig\extension']->lang("RESYNC_POST_MARKING");
                echo "</label><br /><span>";
                echo $this->extensions['phpbb\template\twig\extension']->lang("RESYNC_POST_MARKING_EXPLAIN");
                echo "</span></dt>
\t\t\t\t\t<dd><input type=\"hidden\" name=\"action\" value=\"db_track\" /><input class=\"button2\" type=\"submit\" id=\"action_db_track\" name=\"action_db_track\" value=\"";
                // line 253
                echo $this->extensions['phpbb\template\twig\extension']->lang("RUN");
                echo "\" /></dd>
\t\t\t\t</dl>
\t\t\t</form>

\t\t\t";
                // line 257
                if (($context["S_FOUNDER"] ?? null)) {
                    // line 258
                    echo "\t\t\t<form id=\"action_purge_sessions_form\" method=\"post\" action=\"";
                    echo ($context["U_ACTION"] ?? null);
                    echo "\" data-ajax=\"true\">
\t\t\t\t<dl>
\t\t\t\t\t<dt><label for=\"action_purge_sessions\">";
                    // line 260
                    echo $this->extensions['phpbb\template\twig\extension']->lang("PURGE_SESSIONS");
                    echo "</label><br /><span>";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("PURGE_SESSIONS_EXPLAIN");
                    echo "</span></dt>
\t\t\t\t\t<dd><input type=\"hidden\" name=\"action\" value=\"purge_sessions\" /><input class=\"button2\" type=\"submit\" id=\"action_purge_sessions\" name=\"action_purge_sessions\" value=\"";
                    // line 261
                    echo $this->extensions['phpbb\template\twig\extension']->lang("RUN");
                    echo "\" /></dd>
\t\t\t\t</dl>
\t\t\t</form>
\t\t\t";
                }
                // line 265
                echo "
\t\t\t<form id=\"action_purge_cache_form\" method=\"post\" action=\"";
                // line 266
                echo ($context["U_ACTION"] ?? null);
                echo "\" data-ajax=\"true\">
\t\t\t\t<dl>
\t\t\t\t\t<dt><label for=\"action_purge_cache\">";
                // line 268
                echo $this->extensions['phpbb\template\twig\extension']->lang("PURGE_CACHE");
                echo "</label><br /><span>";
                echo $this->extensions['phpbb\template\twig\extension']->lang("PURGE_CACHE_EXPLAIN");
                echo "</span></dt>
\t\t\t\t\t<dd><input type=\"hidden\" name=\"action\" value=\"purge_cache\" /><input class=\"button2\" type=\"submit\" id=\"action_purge_cache\" name=\"action_purge_cache\" value=\"";
                // line 269
                echo $this->extensions['phpbb\template\twig\extension']->lang("RUN");
                echo "\" /></dd>
\t\t\t\t</dl>
\t\t\t</form>

\t\t\t";
                // line 273
                // line 274
                echo "  \t\t</fieldset>
\t";
            }
            // line 276
            echo "
\t";
            // line 277
            if (twig_length_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "log", [], "any", false, false, false, 277))) {
                // line 278
                echo "\t\t<h2>";
                echo $this->extensions['phpbb\template\twig\extension']->lang("ADMIN_LOG");
                echo "</h2>

\t\t<p>";
                // line 280
                echo $this->extensions['phpbb\template\twig\extension']->lang("ADMIN_LOG_INDEX_EXPLAIN");
                echo "</p>

\t\t<div style=\"text-align: right;\"><a href=\"";
                // line 282
                echo ($context["U_ADMIN_LOG"] ?? null);
                echo "\">&raquo; ";
                echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_ADMIN_LOG");
                echo "</a></div>

\t\t<table class=\"table1 zebra-table\">
\t\t<thead>
\t\t<tr>
\t\t\t<th>";
                // line 287
                echo $this->extensions['phpbb\template\twig\extension']->lang("USERNAME");
                echo "</th>
\t\t\t<th>";
                // line 288
                echo $this->extensions['phpbb\template\twig\extension']->lang("IP");
                echo "</th>
\t\t\t<th>";
                // line 289
                echo $this->extensions['phpbb\template\twig\extension']->lang("TIME");
                echo "</th>
\t\t\t<th>";
                // line 290
                echo $this->extensions['phpbb\template\twig\extension']->lang("ACTION");
                echo "</th>
\t\t</tr>
\t\t</thead>
\t\t<tbody>
\t\t";
                // line 294
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "log", [], "any", false, false, false, 294));
                foreach ($context['_seq'] as $context["_key"] => $context["log"]) {
                    // line 295
                    echo "\t\t\t<tr>
\t\t\t\t<td>";
                    // line 296
                    echo twig_get_attribute($this->env, $this->source, $context["log"], "USERNAME", [], "any", false, false, false, 296);
                    echo "</td>
\t\t\t\t<td style=\"text-align: center;\">";
                    // line 297
                    echo twig_get_attribute($this->env, $this->source, $context["log"], "IP", [], "any", false, false, false, 297);
                    echo "</td>
\t\t\t\t<td style=\"text-align: center;\">";
                    // line 298
                    echo twig_get_attribute($this->env, $this->source, $context["log"], "DATE", [], "any", false, false, false, 298);
                    echo "</td>
\t\t\t\t<td>";
                    // line 299
                    echo twig_get_attribute($this->env, $this->source, $context["log"], "ACTION", [], "any", false, false, false, 299);
                    echo "</td>
\t\t\t</tr>
\t\t";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['log'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 302
                echo "\t\t</tbody>
\t\t</table>
\t";
            }
            // line 305
            echo "
\t";
            // line 306
            if (($context["S_INACTIVE_USERS"] ?? null)) {
                // line 307
                echo "\t\t<h2>";
                echo $this->extensions['phpbb\template\twig\extension']->lang("INACTIVE_USERS");
                echo "</h2>

\t\t<p>";
                // line 309
                echo $this->extensions['phpbb\template\twig\extension']->lang("INACTIVE_USERS_EXPLAIN_INDEX");
                echo "</p>

\t\t<div style=\"text-align: right;\"><a href=\"";
                // line 311
                echo ($context["U_INACTIVE_USERS"] ?? null);
                echo "\">&raquo; ";
                echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_INACTIVE_USERS");
                echo "</a></div>

\t\t<table class=\"table1 zebra-table\">
\t\t<thead>
\t\t<tr>
\t\t\t<th>";
                // line 316
                echo $this->extensions['phpbb\template\twig\extension']->lang("USERNAME");
                echo "</th>
\t\t\t<th>";
                // line 317
                echo $this->extensions['phpbb\template\twig\extension']->lang("JOINED");
                echo "</th>
\t\t\t<th>";
                // line 318
                echo $this->extensions['phpbb\template\twig\extension']->lang("INACTIVE_DATE");
                echo "</th>
\t\t\t<th>";
                // line 319
                echo $this->extensions['phpbb\template\twig\extension']->lang("LAST_VISIT");
                echo "</th>
\t\t\t<th>";
                // line 320
                echo $this->extensions['phpbb\template\twig\extension']->lang("INACTIVE_REASON");
                echo "</th>
\t\t</tr>
\t\t</thead>
\t\t<tbody>
\t\t";
                // line 324
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "inactive", [], "any", false, false, false, 324));
                $context['_iterated'] = false;
                foreach ($context['_seq'] as $context["_key"] => $context["inactive"]) {
                    // line 325
                    echo "\t\t\t<tr>
\t\t\t\t<td style=\"vertical-align: top;\">
\t\t\t\t\t";
                    // line 327
                    echo twig_get_attribute($this->env, $this->source, $context["inactive"], "USERNAME_FULL", [], "any", false, false, false, 327);
                    echo "
\t\t\t\t\t";
                    // line 328
                    if (twig_get_attribute($this->env, $this->source, $context["inactive"], "POSTS", [], "any", false, false, false, 328)) {
                        echo "<br />";
                        echo $this->extensions['phpbb\template\twig\extension']->lang("POSTS");
                        echo $this->extensions['phpbb\template\twig\extension']->lang("COLON");
                        echo " <strong>";
                        echo twig_get_attribute($this->env, $this->source, $context["inactive"], "POSTS", [], "any", false, false, false, 328);
                        echo "</strong> [<a href=\"";
                        echo twig_get_attribute($this->env, $this->source, $context["inactive"], "U_SEARCH_USER", [], "any", false, false, false, 328);
                        echo "\">";
                        echo $this->extensions['phpbb\template\twig\extension']->lang("SEARCH_USER_POSTS");
                        echo "</a>]";
                    }
                    // line 329
                    echo "\t\t\t\t</td>
\t\t\t\t<td style=\"vertical-align: top;\">";
                    // line 330
                    echo twig_get_attribute($this->env, $this->source, $context["inactive"], "JOINED", [], "any", false, false, false, 330);
                    echo "</td>
\t\t\t\t<td style=\"vertical-align: top;\">";
                    // line 331
                    echo twig_get_attribute($this->env, $this->source, $context["inactive"], "INACTIVE_DATE", [], "any", false, false, false, 331);
                    echo "</td>
\t\t\t\t<td style=\"vertical-align: top;\">";
                    // line 332
                    echo twig_get_attribute($this->env, $this->source, $context["inactive"], "LAST_VISIT", [], "any", false, false, false, 332);
                    echo "</td>
\t\t\t\t<td style=\"vertical-align: top;\">
\t\t\t\t\t";
                    // line 334
                    echo twig_get_attribute($this->env, $this->source, $context["inactive"], "REASON", [], "any", false, false, false, 334);
                    echo "
\t\t\t\t\t";
                    // line 335
                    if (twig_get_attribute($this->env, $this->source, $context["inactive"], "REMINDED", [], "any", false, false, false, 335)) {
                        echo "<br />";
                        echo twig_get_attribute($this->env, $this->source, $context["inactive"], "REMINDED_EXPLAIN", [], "any", false, false, false, 335);
                    }
                    // line 336
                    echo "\t\t\t\t</td>
\t\t\t</tr>
\t\t";
                    $context['_iterated'] = true;
                }
                if (!$context['_iterated']) {
                    // line 339
                    echo "\t\t\t<tr>
\t\t\t\t<td colspan=\"5\" style=\"text-align: center;\">";
                    // line 340
                    echo $this->extensions['phpbb\template\twig\extension']->lang("NO_INACTIVE_USERS");
                    echo "</td>
\t\t\t</tr>
\t\t";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['inactive'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 343
                echo "\t\t</tbody>
\t\t</table>
\t";
            }
            // line 346
            echo "
";
        }
        // line 348
        echo "
";
        // line 349
        $location = "overall_footer.html";
        $namespace = false;
        if (strpos($location, '@') === 0) {
            $namespace = substr($location, 1, strpos($location, '/') - 1);
            $previous_look_up_order = $this->env->getNamespaceLookUpOrder();
            $this->env->setNamespaceLookUpOrder(array($namespace, '__main__'));
        }
        $this->loadTemplate("overall_footer.html", "acp_main.html", 349)->display($context);
        if ($namespace) {
            $this->env->setNamespaceLookUpOrder($previous_look_up_order);
        }
    }

    public function getTemplateName()
    {
        return "acp_main.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  943 => 349,  940 => 348,  936 => 346,  931 => 343,  922 => 340,  919 => 339,  912 => 336,  907 => 335,  903 => 334,  898 => 332,  894 => 331,  890 => 330,  887 => 329,  874 => 328,  870 => 327,  866 => 325,  861 => 324,  854 => 320,  850 => 319,  846 => 318,  842 => 317,  838 => 316,  828 => 311,  823 => 309,  817 => 307,  815 => 306,  812 => 305,  807 => 302,  798 => 299,  794 => 298,  790 => 297,  786 => 296,  783 => 295,  779 => 294,  772 => 290,  768 => 289,  764 => 288,  760 => 287,  750 => 282,  745 => 280,  739 => 278,  737 => 277,  734 => 276,  730 => 274,  729 => 273,  722 => 269,  716 => 268,  711 => 266,  708 => 265,  701 => 261,  695 => 260,  689 => 258,  687 => 257,  680 => 253,  674 => 252,  669 => 250,  662 => 246,  656 => 245,  651 => 243,  644 => 239,  638 => 238,  633 => 236,  626 => 232,  622 => 231,  617 => 229,  610 => 225,  606 => 224,  601 => 222,  596 => 220,  593 => 219,  591 => 218,  585 => 214,  578 => 209,  576 => 208,  571 => 206,  567 => 205,  561 => 202,  557 => 201,  551 => 198,  547 => 197,  541 => 194,  537 => 193,  531 => 190,  527 => 189,  521 => 186,  517 => 185,  511 => 182,  507 => 181,  501 => 178,  497 => 177,  488 => 171,  484 => 170,  476 => 164,  455 => 160,  450 => 158,  447 => 157,  445 => 156,  441 => 154,  435 => 152,  425 => 150,  423 => 149,  418 => 147,  412 => 144,  408 => 143,  402 => 140,  398 => 139,  392 => 136,  388 => 135,  382 => 132,  378 => 131,  372 => 128,  368 => 127,  362 => 124,  358 => 123,  352 => 120,  348 => 119,  339 => 113,  335 => 112,  328 => 107,  327 => 106,  324 => 105,  318 => 102,  315 => 101,  313 => 100,  310 => 99,  304 => 96,  301 => 95,  299 => 94,  296 => 93,  293 => 92,  287 => 89,  283 => 88,  280 => 87,  278 => 86,  275 => 85,  269 => 82,  265 => 81,  262 => 80,  260 => 79,  257 => 78,  251 => 75,  247 => 74,  244 => 73,  242 => 72,  239 => 71,  233 => 68,  229 => 67,  226 => 66,  224 => 65,  221 => 64,  215 => 61,  211 => 60,  208 => 59,  205 => 58,  203 => 57,  200 => 56,  194 => 53,  190 => 52,  187 => 51,  185 => 50,  182 => 49,  176 => 46,  172 => 45,  169 => 44,  167 => 43,  164 => 42,  158 => 39,  155 => 38,  152 => 37,  146 => 34,  143 => 33,  141 => 32,  130 => 30,  126 => 29,  123 => 28,  121 => 27,  110 => 25,  106 => 24,  102 => 23,  99 => 22,  97 => 21,  88 => 19,  85 => 18,  83 => 17,  78 => 15,  73 => 13,  70 => 12,  64 => 9,  59 => 7,  56 => 6,  54 => 5,  49 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "acp_main.html", "");
    }
}
