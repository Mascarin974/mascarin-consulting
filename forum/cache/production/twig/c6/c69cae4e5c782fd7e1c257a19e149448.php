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

/* mcp_front.html */
class __TwigTemplate_a4092622b5aa5876d1325151bf2ab5ff extends \Twig\Template
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
        $location = "mcp_header.html";
        $namespace = false;
        if (strpos($location, '@') === 0) {
            $namespace = substr($location, 1, strpos($location, '/') - 1);
            $previous_look_up_order = $this->env->getNamespaceLookUpOrder();
            $this->env->setNamespaceLookUpOrder(array($namespace, '__main__'));
        }
        $this->loadTemplate("mcp_header.html", "mcp_front.html", 1)->display($context);
        if ($namespace) {
            $this->env->setNamespaceLookUpOrder($previous_look_up_order);
        }
        // line 2
        echo "
<h2>";
        // line 3
        echo ($context["PAGE_TITLE"] ?? null);
        echo "</h2>

";
        // line 5
        // line 6
        echo "
";
        // line 7
        if (($context["S_SHOW_UNAPPROVED"] ?? null)) {
            // line 8
            echo "
\t<form id=\"mcp_queue\" method=\"post\" action=\"";
            // line 9
            echo ($context["S_MCP_QUEUE_ACTION"] ?? null);
            echo "\">

\t<div class=\"panel\">
\t\t<div class=\"inner\">

\t\t<h3>";
            // line 14
            echo $this->extensions['phpbb\template\twig\extension']->lang("LATEST_UNAPPROVED");
            echo "</h3>
\t\t<p>";
            // line 15
            echo $this->extensions['phpbb\template\twig\extension']->lang("UNAPPROVED_TOTAL");
            echo "</p>

\t\t";
            // line 17
            if (twig_length_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "unapproved", [], "any", false, false, false, 17))) {
                // line 18
                echo "\t\t\t<ul class=\"topiclist missing-column\">
\t\t\t\t<li class=\"header\">
\t\t\t\t\t<dl>
\t\t\t\t\t\t<dt><div class=\"list-inner\">";
                // line 21
                echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_DETAILS");
                echo "</div></dt>
\t\t\t\t\t\t<dd class=\"moderation\"><span>";
                // line 22
                echo $this->extensions['phpbb\template\twig\extension']->lang("TOPIC");
                echo " &amp; ";
                echo $this->extensions['phpbb\template\twig\extension']->lang("FORUM");
                echo "</span></dd>
\t\t\t\t\t\t<dd class=\"mark\">";
                // line 23
                echo $this->extensions['phpbb\template\twig\extension']->lang("MARK");
                echo "</dd>
\t\t\t\t\t</dl>
\t\t\t\t</li>
\t\t\t</ul>
\t\t\t<ul class=\"topiclist cplist missing-column responsive-show-all\">

\t\t\t";
                // line 29
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "unapproved", [], "any", false, false, false, 29));
                foreach ($context['_seq'] as $context["_key"] => $context["unapproved"]) {
                    // line 30
                    echo "\t\t\t<li class=\"row";
                    if ((twig_get_attribute($this->env, $this->source, $context["unapproved"], "S_ROW_COUNT", [], "any", false, false, false, 30) % 2 != 0)) {
                        echo " bg1";
                    } else {
                        echo " bg2";
                    }
                    echo "\">
\t\t\t\t<dl>
\t\t\t\t\t<dt>
\t\t\t\t\t\t<div class=\"list-inner\">
\t\t\t\t\t\t\t<a href=\"";
                    // line 34
                    echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "U_POST_DETAILS", [], "any", false, false, false, 34);
                    echo "\" class=\"topictitle\">";
                    echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "SUBJECT", [], "any", false, false, false, 34);
                    echo "</a> ";
                    if (twig_get_attribute($this->env, $this->source, $context["unapproved"], "ATTACH_ICON_IMG", [], "any", false, false, false, 34)) {
                        echo "<i class=\"icon fa-paperclip fa-fw\" aria-hidden=\"true\"></i>";
                    }
                    echo " <br />
\t\t\t\t\t\t\t";
                    // line 35
                    echo $this->extensions['phpbb\template\twig\extension']->lang("POSTED");
                    echo " ";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("POST_BY_AUTHOR");
                    echo " ";
                    echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "AUTHOR_FULL", [], "any", false, false, false, 35);
                    echo " &raquo; ";
                    echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "POST_TIME", [], "any", false, false, false, 35);
                    echo "
\t\t\t\t\t\t</div>
\t\t\t\t\t</dt>
\t\t\t\t\t<dd class=\"moderation\"><span>
\t\t\t\t\t\t";
                    // line 39
                    echo $this->extensions['phpbb\template\twig\extension']->lang("TOPIC");
                    echo $this->extensions['phpbb\template\twig\extension']->lang("COLON");
                    echo " <a href=\"";
                    echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "U_TOPIC", [], "any", false, false, false, 39);
                    echo "\">";
                    echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "TOPIC_TITLE", [], "any", false, false, false, 39);
                    echo "</a> [<a href=\"";
                    echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "U_MCP_TOPIC", [], "any", false, false, false, 39);
                    echo "\">";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("MODERATE");
                    echo "</a>]<br />
\t\t\t\t\t\t";
                    // line 40
                    echo $this->extensions['phpbb\template\twig\extension']->lang("FORUM");
                    echo $this->extensions['phpbb\template\twig\extension']->lang("COLON");
                    echo " ";
                    if (twig_get_attribute($this->env, $this->source, $context["unapproved"], "U_FORUM", [], "any", false, false, false, 40)) {
                        echo "<a href=\"";
                        echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "U_FORUM", [], "any", false, false, false, 40);
                        echo "\">";
                        echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "FORUM_NAME", [], "any", false, false, false, 40);
                        echo "</a>";
                    } else {
                        echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "FORUM_NAME", [], "any", false, false, false, 40);
                    }
                    if (twig_get_attribute($this->env, $this->source, $context["unapproved"], "U_MCP_FORUM", [], "any", false, false, false, 40)) {
                        echo " [<a href=\"";
                        echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "U_MCP_FORUM", [], "any", false, false, false, 40);
                        echo "\">";
                        echo $this->extensions['phpbb\template\twig\extension']->lang("MODERATE");
                        echo "</a>]";
                    }
                    echo "</span>
\t\t\t\t\t</dd>

\t\t\t \t\t<dd class=\"mark\"><input type=\"checkbox\" name=\"post_id_list[]\" value=\"";
                    // line 43
                    echo twig_get_attribute($this->env, $this->source, $context["unapproved"], "POST_ID", [], "any", false, false, false, 43);
                    echo "\" /></dd>
\t\t\t\t</dl>
\t\t\t</li>
\t\t\t";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['unapproved'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 47
                echo "\t\t\t</ul>
\t\t";
            }
            // line 49
            echo "
\t\t</div>
\t";
            // line 51
            echo ($context["S_FORM_TOKEN"] ?? null);
            echo "
\t</div>

\t";
            // line 54
            if (twig_length_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "unapproved", [], "any", false, false, false, 54))) {
                // line 55
                echo "\t<fieldset class=\"display-actions\">
\t\t";
                // line 56
                echo ($context["S_HIDDEN_FIELDS"] ?? null);
                echo "
\t\t<input class=\"button2\" type=\"submit\" name=\"action[disapprove]\" value=\"";
                // line 57
                echo $this->extensions['phpbb\template\twig\extension']->lang("DISAPPROVE");
                echo "\" />&nbsp;
\t\t<input class=\"button1\" type=\"submit\" name=\"action[approve]\" value=\"";
                // line 58
                echo $this->extensions['phpbb\template\twig\extension']->lang("APPROVE");
                echo "\" />
\t\t<div><a href=\"#\" onclick=\"marklist('mcp_queue', 'post_id_list', true); return false;\">";
                // line 59
                echo $this->extensions['phpbb\template\twig\extension']->lang("MARK_ALL");
                echo "</a> :: <a href=\"#\" onclick=\"marklist('mcp_queue', 'post_id_list', false); return false;\">";
                echo $this->extensions['phpbb\template\twig\extension']->lang("UNMARK_ALL");
                echo "</a></div>
\t</fieldset>
\t";
            }
            // line 62
            echo "\t\t</form>
";
        }
        // line 64
        echo "
";
        // line 65
        // line 66
        echo "
";
        // line 67
        if (($context["S_SHOW_REPORTS"] ?? null)) {
            // line 68
            echo "\t<div class=\"panel\">
\t\t<div class=\"inner\">

\t\t<h3>";
            // line 71
            echo $this->extensions['phpbb\template\twig\extension']->lang("LATEST_REPORTED");
            echo "</h3>
\t\t<p>";
            // line 72
            echo $this->extensions['phpbb\template\twig\extension']->lang("REPORTS_TOTAL");
            echo "</p>

\t\t";
            // line 74
            if (twig_length_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "report", [], "any", false, false, false, 74))) {
                // line 75
                echo "\t\t\t<ul class=\"topiclist two-long-columns\">
\t\t\t\t<li class=\"header\">
\t\t\t\t\t<dl>
\t\t\t\t\t\t<dt><div class=\"list-inner\">";
                // line 78
                echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_DETAILS");
                echo "</div></dt>
\t\t\t\t\t\t<dd class=\"moderation\"><span>";
                // line 79
                echo $this->extensions['phpbb\template\twig\extension']->lang("REPORTER");
                echo " &amp; ";
                echo $this->extensions['phpbb\template\twig\extension']->lang("FORUM");
                echo "</span></dd>
\t\t\t\t\t</dl>
\t\t\t\t</li>
\t\t\t</ul>
\t\t\t<ul class=\"topiclist cplist two-long-columns responsive-show-all\">

\t\t\t";
                // line 85
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "report", [], "any", false, false, false, 85));
                foreach ($context['_seq'] as $context["_key"] => $context["report"]) {
                    // line 86
                    echo "\t\t\t<li class=\"row";
                    if ((twig_get_attribute($this->env, $this->source, $context["report"], "S_ROW_COUNT", [], "any", false, false, false, 86) % 2 != 0)) {
                        echo " bg1";
                    } else {
                        echo " bg2";
                    }
                    echo "\">
\t\t\t\t<dl>
\t\t\t\t\t<dt>
\t\t\t\t\t\t<div class=\"list-inner\">
\t\t\t\t\t\t\t<a href=\"";
                    // line 90
                    echo twig_get_attribute($this->env, $this->source, $context["report"], "U_POST_DETAILS", [], "any", false, false, false, 90);
                    echo "#reports\" class=\"topictitle\">";
                    echo twig_get_attribute($this->env, $this->source, $context["report"], "SUBJECT", [], "any", false, false, false, 90);
                    echo "</a> ";
                    if (twig_get_attribute($this->env, $this->source, $context["report"], "ATTACH_ICON_IMG", [], "any", false, false, false, 90)) {
                        echo "<i class=\"icon fa-paperclip fa-fw\" aria-hidden=\"true\"></i>";
                    }
                    echo " <br />
\t\t\t\t\t\t\t<span>";
                    // line 91
                    echo $this->extensions['phpbb\template\twig\extension']->lang("POSTED");
                    echo " ";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("POST_BY_AUTHOR");
                    echo " ";
                    echo twig_get_attribute($this->env, $this->source, $context["report"], "AUTHOR_FULL", [], "any", false, false, false, 91);
                    echo " &raquo; ";
                    echo twig_get_attribute($this->env, $this->source, $context["report"], "POST_TIME", [], "any", false, false, false, 91);
                    echo "</span>
\t\t\t\t\t\t</div>
\t\t\t\t\t</dt>
\t\t\t\t\t<dd class=\"moderation\">
\t\t\t\t\t\t<span>";
                    // line 95
                    echo $this->extensions['phpbb\template\twig\extension']->lang("REPORTED");
                    echo " ";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("POST_BY_AUTHOR");
                    echo " ";
                    echo twig_get_attribute($this->env, $this->source, $context["report"], "REPORTER_FULL", [], "any", false, false, false, 95);
                    echo " ";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("REPORTED_ON_DATE");
                    echo " ";
                    echo twig_get_attribute($this->env, $this->source, $context["report"], "REPORT_TIME", [], "any", false, false, false, 95);
                    echo "<br />
\t\t\t\t\t\t";
                    // line 96
                    echo $this->extensions['phpbb\template\twig\extension']->lang("FORUM");
                    echo $this->extensions['phpbb\template\twig\extension']->lang("COLON");
                    echo " <a href=\"";
                    echo twig_get_attribute($this->env, $this->source, $context["report"], "U_FORUM", [], "any", false, false, false, 96);
                    echo "\">";
                    echo twig_get_attribute($this->env, $this->source, $context["report"], "FORUM_NAME", [], "any", false, false, false, 96);
                    echo "</a></span>
\t\t\t\t\t</dd>
\t\t\t\t</dl>
\t\t\t</li>
\t\t\t";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['report'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 101
                echo "\t\t\t</ul>
\t\t";
            }
            // line 103
            echo "
\t\t</div>
\t</div>
";
        }
        // line 107
        echo "
";
        // line 108
        // line 109
        echo "
";
        // line 110
        if (($context["S_SHOW_PM_REPORTS"] ?? null)) {
            // line 111
            echo "\t<div class=\"panel\">
\t\t<div class=\"inner\">

\t\t<h3>";
            // line 114
            echo $this->extensions['phpbb\template\twig\extension']->lang("LATEST_REPORTED_PMS");
            echo "</h3>
\t\t<p>";
            // line 115
            echo $this->extensions['phpbb\template\twig\extension']->lang("PM_REPORTS_TOTAL");
            echo "</p>

\t\t";
            // line 117
            if (twig_length_filter($this->env, twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "pm_report", [], "any", false, false, false, 117))) {
                // line 118
                echo "\t\t\t<ul class=\"topiclist two-long-columns\">
\t\t\t\t<li class=\"header\">
\t\t\t\t\t<dl>
\t\t\t\t\t\t<dt><div class=\"list-inner\">";
                // line 121
                echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_DETAILS");
                echo "</div></dt>
\t\t\t\t\t\t<dd class=\"moderation\"><span>";
                // line 122
                echo $this->extensions['phpbb\template\twig\extension']->lang("REPORTER");
                echo "</span></dd>
\t\t\t\t\t</dl>
\t\t\t\t</li>
\t\t\t</ul>
\t\t\t<ul class=\"topiclist cplist two-long-columns responsive-show-all\">

\t\t\t";
                // line 128
                $context['_parent'] = $context;
                $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "pm_report", [], "any", false, false, false, 128));
                foreach ($context['_seq'] as $context["_key"] => $context["pm_report"]) {
                    // line 129
                    echo "\t\t\t<li class=\"row";
                    if ((twig_get_attribute($this->env, $this->source, $context["pm_report"], "S_ROW_COUNT", [], "any", false, false, false, 129) % 2 != 0)) {
                        echo " bg1";
                    } else {
                        echo " bg2";
                    }
                    echo "\">
\t\t\t\t<dl>
\t\t\t\t\t<dt>
\t\t\t\t\t\t<div class=\"list-inner\">
\t\t\t\t\t\t\t<a href=\"";
                    // line 133
                    echo twig_get_attribute($this->env, $this->source, $context["pm_report"], "U_PM_DETAILS", [], "any", false, false, false, 133);
                    echo "\" class=\"topictitle\">";
                    echo twig_get_attribute($this->env, $this->source, $context["pm_report"], "PM_SUBJECT", [], "any", false, false, false, 133);
                    echo "</a> ";
                    if (twig_get_attribute($this->env, $this->source, $context["pm_report"], "ATTACH_ICON_IMG", [], "any", false, false, false, 133)) {
                        echo "<i class=\"icon fa-paperclip fa-fw\" aria-hidden=\"true\"></i>";
                    }
                    echo " <br />
\t\t\t\t\t\t\t<span>";
                    // line 134
                    echo $this->extensions['phpbb\template\twig\extension']->lang("MESSAGE_BY_AUTHOR");
                    echo " ";
                    echo twig_get_attribute($this->env, $this->source, $context["pm_report"], "PM_AUTHOR_FULL", [], "any", false, false, false, 134);
                    echo " &raquo; ";
                    echo twig_get_attribute($this->env, $this->source, $context["pm_report"], "PM_TIME", [], "any", false, false, false, 134);
                    echo "</span><br />
\t\t\t\t\t\t\t<span>";
                    // line 135
                    echo $this->extensions['phpbb\template\twig\extension']->lang("MESSAGE_TO");
                    echo " ";
                    echo twig_get_attribute($this->env, $this->source, $context["pm_report"], "RECIPIENTS", [], "any", false, false, false, 135);
                    echo "</span>
\t\t\t\t\t\t</div>
\t\t\t\t\t</dt>
\t\t\t\t\t<dd class=\"moderation\">
\t\t\t\t\t\t<span>";
                    // line 139
                    echo $this->extensions['phpbb\template\twig\extension']->lang("REPORTED");
                    echo " ";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("POST_BY_AUTHOR");
                    echo " ";
                    echo twig_get_attribute($this->env, $this->source, $context["pm_report"], "REPORTER_FULL", [], "any", false, false, false, 139);
                    echo " ";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("REPORTED_ON_DATE");
                    echo " ";
                    echo twig_get_attribute($this->env, $this->source, $context["pm_report"], "REPORT_TIME", [], "any", false, false, false, 139);
                    echo "</span>
\t\t\t\t\t</dd>
\t\t\t\t</dl>
\t\t\t</li>
\t\t\t";
                }
                $_parent = $context['_parent'];
                unset($context['_seq'], $context['_iterated'], $context['_key'], $context['pm_report'], $context['_parent'], $context['loop']);
                $context = array_intersect_key($context, $_parent) + $_parent;
                // line 144
                echo "\t\t\t</ul>
\t\t";
            }
            // line 146
            echo "
\t\t</div>
\t</div>
";
        }
        // line 150
        echo "
";
        // line 151
        // line 152
        echo "
";
        // line 153
        if (($context["S_SHOW_LOGS"] ?? null)) {
            // line 154
            echo "\t<div class=\"panel\">
\t\t<div class=\"inner\">

\t\t<h3>";
            // line 157
            echo $this->extensions['phpbb\template\twig\extension']->lang("LATEST_LOGS");
            echo "</h3>

\t\t<table class=\"table1\">
\t\t<thead>
\t\t<tr>
\t\t\t<th class=\"name\">";
            // line 162
            echo $this->extensions['phpbb\template\twig\extension']->lang("ACTION");
            echo "</th>
\t\t\t<th class=\"name\">";
            // line 163
            echo $this->extensions['phpbb\template\twig\extension']->lang("USERNAME");
            echo "</th>
\t\t\t<th class=\"name\">";
            // line 164
            echo $this->extensions['phpbb\template\twig\extension']->lang("IP");
            echo "</th>
\t\t\t<th class=\"name\">";
            // line 165
            echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_TOPIC");
            echo "</th>
\t\t\t<th class=\"name\">";
            // line 166
            echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_TOPIC_LOGS");
            echo "</th>
\t\t\t<th class=\"name\">";
            // line 167
            echo $this->extensions['phpbb\template\twig\extension']->lang("TIME");
            echo "</th>
\t\t</tr>
\t\t</thead>
\t\t<tbody>
\t";
            // line 171
            $context['_parent'] = $context;
            $context['_seq'] = twig_ensure_traversable(twig_get_attribute($this->env, $this->source, ($context["loops"] ?? null), "log", [], "any", false, false, false, 171));
            $context['_iterated'] = false;
            foreach ($context['_seq'] as $context["_key"] => $context["log"]) {
                // line 172
                echo "\t\t<tr class=\"";
                if ((twig_get_attribute($this->env, $this->source, $context["log"], "S_ROW_COUNT", [], "any", false, false, false, 172) % 2 == 0)) {
                    echo "bg1";
                } else {
                    echo "bg2";
                }
                echo "\">
\t\t\t<td>";
                // line 173
                echo twig_get_attribute($this->env, $this->source, $context["log"], "ACTION", [], "any", false, false, false, 173);
                echo "</td>
\t\t\t<td><span>";
                // line 174
                echo twig_get_attribute($this->env, $this->source, $context["log"], "USERNAME", [], "any", false, false, false, 174);
                echo "</span></td>
\t\t\t<td><span>";
                // line 175
                echo twig_get_attribute($this->env, $this->source, $context["log"], "IP", [], "any", false, false, false, 175);
                echo "</span></td>
\t\t\t<td><span>";
                // line 176
                if (twig_get_attribute($this->env, $this->source, $context["log"], "U_VIEW_TOPIC", [], "any", false, false, false, 176)) {
                    echo "<a href=\"";
                    echo twig_get_attribute($this->env, $this->source, $context["log"], "U_VIEW_TOPIC", [], "any", false, false, false, 176);
                    echo "\" title=\"";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_TOPIC");
                    echo "\">";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_TOPIC");
                    echo "</a>";
                }
                echo "&nbsp;</span></td>
\t\t\t<td><span>";
                // line 177
                if (twig_get_attribute($this->env, $this->source, $context["log"], "U_VIEWLOGS", [], "any", false, false, false, 177)) {
                    echo "<a href=\"";
                    echo twig_get_attribute($this->env, $this->source, $context["log"], "U_VIEWLOGS", [], "any", false, false, false, 177);
                    echo "\">";
                    echo $this->extensions['phpbb\template\twig\extension']->lang("VIEW_TOPIC_LOGS");
                    echo "</a>";
                }
                echo "&nbsp;</span></td>
\t\t\t<td><span>";
                // line 178
                echo twig_get_attribute($this->env, $this->source, $context["log"], "TIME", [], "any", false, false, false, 178);
                echo "</span></td>
\t\t</tr>
\t";
                $context['_iterated'] = true;
            }
            if (!$context['_iterated']) {
                // line 181
                echo "\t\t<tr>
\t\t\t<td colspan=\"6\">";
                // line 182
                echo $this->extensions['phpbb\template\twig\extension']->lang("NO_ENTRIES");
                echo "</td>
\t\t</tr>
\t";
            }
            $_parent = $context['_parent'];
            unset($context['_seq'], $context['_iterated'], $context['_key'], $context['log'], $context['_parent'], $context['loop']);
            $context = array_intersect_key($context, $_parent) + $_parent;
            // line 185
            echo "\t\t</tbody>
\t\t</table>

\t\t</div>
\t</div>
";
        }
        // line 191
        echo "
";
        // line 192
        // line 193
        echo "
";
        // line 194
        $location = "mcp_footer.html";
        $namespace = false;
        if (strpos($location, '@') === 0) {
            $namespace = substr($location, 1, strpos($location, '/') - 1);
            $previous_look_up_order = $this->env->getNamespaceLookUpOrder();
            $this->env->setNamespaceLookUpOrder(array($namespace, '__main__'));
        }
        $this->loadTemplate("mcp_footer.html", "mcp_front.html", 194)->display($context);
        if ($namespace) {
            $this->env->setNamespaceLookUpOrder($previous_look_up_order);
        }
    }

    public function getTemplateName()
    {
        return "mcp_front.html";
    }

    public function isTraitable()
    {
        return false;
    }

    public function getDebugInfo()
    {
        return array (  607 => 194,  604 => 193,  603 => 192,  600 => 191,  592 => 185,  583 => 182,  580 => 181,  572 => 178,  562 => 177,  550 => 176,  546 => 175,  542 => 174,  538 => 173,  529 => 172,  524 => 171,  517 => 167,  513 => 166,  509 => 165,  505 => 164,  501 => 163,  497 => 162,  489 => 157,  484 => 154,  482 => 153,  479 => 152,  478 => 151,  475 => 150,  469 => 146,  465 => 144,  446 => 139,  437 => 135,  429 => 134,  419 => 133,  407 => 129,  403 => 128,  394 => 122,  390 => 121,  385 => 118,  383 => 117,  378 => 115,  374 => 114,  369 => 111,  367 => 110,  364 => 109,  363 => 108,  360 => 107,  354 => 103,  350 => 101,  334 => 96,  322 => 95,  309 => 91,  299 => 90,  287 => 86,  283 => 85,  272 => 79,  268 => 78,  263 => 75,  261 => 74,  256 => 72,  252 => 71,  247 => 68,  245 => 67,  242 => 66,  241 => 65,  238 => 64,  234 => 62,  226 => 59,  222 => 58,  218 => 57,  214 => 56,  211 => 55,  209 => 54,  203 => 51,  199 => 49,  195 => 47,  185 => 43,  161 => 40,  148 => 39,  135 => 35,  125 => 34,  113 => 30,  109 => 29,  100 => 23,  94 => 22,  90 => 21,  85 => 18,  83 => 17,  78 => 15,  74 => 14,  66 => 9,  63 => 8,  61 => 7,  58 => 6,  57 => 5,  52 => 3,  49 => 2,  37 => 1,);
    }

    public function getSourceContext()
    {
        return new Source("", "mcp_front.html", "");
    }
}
